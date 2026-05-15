library(shiny)
library(shinydashboard)
library(dplyr)
library(tidyverse)
library(DT)
library(DBI)
library(RPostgreSQL)
library(stringr)
library(foreign)

restaurant <- "bones"

if (restaurant == "bones") {
  db    <- "bones_wine"
  color <- "red"
  major <- 4
} else if (restaurant == "brg") {
  db    <- "brg_wine"
  color <- "blue"
  major <- 3
}

db_host <- Sys.getenv("db_host")
db_port <- "5432"
db_user <- Sys.getenv("db_user")
db_pass <- Sys.getenv("db_pass")

con <- dbConnect(RPostgres::Postgres(),
  dbname = db, host = db_host, port = db_port,
  user = db_user, password = db_pass
)

bottleSizeDF <- dbGetQuery(con, "select * from bottle_sizes")

locationQuery <- "select pila.product_instance_location_id, pila.product_instance_id
  from product_instances pi, product_instance_location_associations pila
  where pi.product_instance_id = pila.product_instance_id
  and pi.active = true and pila.active_location = true
  and pila.default_sale_location = true"
productLocationDF <- dbGetQuery(con, locationQuery)

pluQuery <- "select pppia.*,
  pi.unit_price, pi.is_club_list_selection,
  pi.is_clearance, pi.bottle_size_id
  from pos_plu_product_instance_associations pppia,
  product_instances pi
  where pi.product_instance_id = pppia.product_instance_id"
PLUDF <- dbGetQuery(con, pluQuery)

ui <- dashboardPage(
  skin = color,
  dashboardHeader(title = paste("Import Sales for:", restaurant)),
  dashboardSidebar(
    fileInput(inputId = "zipFile",
              label = "Upload Aloha zip file",
              accept = c(".zip"))
  ),
  dashboardBody(
    tabsetPanel(
      tabPanel("Table",
        fluidPage(
          fluidRow(
            column(4, valueBoxOutput("totalOutput", width = 10)),
            column(4, valueBoxOutput("glassOutput", width = 10)),
            column(4, valueBoxOutput("bottleOutput", width = 10))
          ),
          fluidRow(column(12, DT::dataTableOutput("salesTable")))
        )
      )
    )
  )
)

server <- function(input, output, session) {
  observe({
    if (!is.null(input$zipFile)) {
      fname    <- unzip(input$zipFile$datapath)
      dataDir  <- dirname(fname[1])

      catDF    <- read.dbf(file.path(dataDir, "CAT.DBF"))    %>% select(ID, NAME)
      itmDF    <- read.dbf(file.path(dataDir, "ITM.DBF"))    %>% select(ID, LONGNAME)
      empDF    <- read.dbf(file.path(dataDir, "EMP.DBF"))    %>% select(ID, FIRSTNAME, LASTNAME)
      gnditemDF <- read.dbf(file.path(dataDir, "GNDITEM.dbf")) %>%
        select(EMPLOYEE, CHECK, HOUR, MINUTE, ITEM, QUANTITY, MODCODE, PRICE, SYSDATE, CATEGORY, TABLEID) %>%
        filter(!is.na(ITEM))

      salesDataDF <- merge(gnditemDF, empDF, by.x = "EMPLOYEE", by.y = "ID")
      salesDataDF <- merge(salesDataDF, catDF, by.x = "CATEGORY", by.y = "ID")
      salesDataDF <- merge(salesDataDF, itmDF, by.x = "ITEM", by.y = "ID") %>%
        filter(NAME == "WINE") %>%
        mutate(across(c(FIRSTNAME, LASTNAME, LONGNAME, NAME), as.character))

      salesDataDF <- as_tibble(salesDataDF)
      salesDataDF <- merge(salesDataDF, PLUDF, by.x = "ITEM", by.y = "pos_plu")
      salesDataDF <- merge(salesDataDF, productLocationDF,
                           by.x = "product_instance_id", by.y = "product_instance_id")
      salesDataDF <- merge(salesDataDF, bottleSizeDF,
                           by.x = "bottle_size_id", by.y = "bottle_size_id")
      salesDataDF <- salesDataDF %>% arrange(CHECK, HOUR, MINUTE)

      unlink(dataDir, recursive = TRUE)

      salesDataTable <- datatable(salesDataDF,
        rownames = FALSE,
        extensions = c("Buttons", "ColReorder"),
        filter = "top",
        options = list(
          pageLength = -1,
          lengthChange = TRUE,
          dom = "Bfrtip",
          colReorder = TRUE,
          buttons = c("colvis", "pageLength", "copy", "csv", "excel", "pdf", "print")
        )
      )
      output$salesTable <- DT::renderDataTable(salesDataTable)

      # Idempotent insert — skip dates already in pos_chkitems
      dateList <- salesDataDF %>% select(SYSDATE) %>% distinct()
      for (date in dateList) {
        seQuery <- "select count(*) from pos_chkitems where date_of_sale = ($1)"
        result  <- dbGetQuery(con, seQuery, list(date))
        if (result[1, 1] == 0) {
          thisDate <- data.frame(salesDataDF %>% filter(SYSDATE == date) %>% arrange(CHECK, HOUR, MINUTE))
          for (i in 1:nrow(thisDate)) {
            row    <- thisDate[i, ]
            tos    <- as.integer(paste(row$HOUR, row$MINUTE, sep = ""))
            rowQuery <- "insert into pos_chkitems (
              date_of_sale, check_num, item_num,
              major, minor, sales_cat,
              num_sold, menu_price, sales_amt,
              table_number, user_num, time_of_sale,
              shift, product_instance_id, product_instance_location_id,
              is_inventory_unit, sales_volume_unit_id, sales_units_sold,
              pos_product_name, unit_cost_at_time_of_sale, is_option,
              disc_num, tax_code, user_name_first,
              user_name_last, is_club_list_sale, is_clearance_sale, deletion, overring)
              values (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19,
              $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)"
            paramList <- list(
              row$SYSDATE, row$CHECK, row$ITEM,
              major, minor, row$CATEGORY,
              row$QUANTITY, row$PRICE, row$PRICE,
              row$TABLEID, row$EMPLOYEE, tos,
              NA, row$product_instance_id, row$product_instance_location_id,
              row$is_inventory_unit, row$sales_unit_id, row$number_sales_units,
              NA, row$unit_price, FALSE,
              0, 1, row$FIRSTNAME,
              row$LASTNAME, row$is_club_list_selection, row$is_clearance,
              0, FALSE
            )
            dbGetQuery(con, rowQuery, paramList)
          }
        }
      }
    }
  })
}

shinyApp(ui, server)
