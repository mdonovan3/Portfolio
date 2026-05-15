library(shiny)
library(shinydashboard)
library(dplyr)
library(DT)
library(DBI)
library(RPostgreSQL)
library(stringr)
library(shinyjs)

db      <- Sys.getenv("db_name")   # bones_wine or brg_wine
db_host <- Sys.getenv("db_host")
db_port <- "5432"
db_user <- Sys.getenv("db_user")
db_pass <- Sys.getenv("db_pass")
color   <- if (db == "bones_wine") "red" else "blue"

con <- dbConnect(RPostgres::Postgres(), dbname = db, host = db_host, port = db_port, user = db_user, password = db_pass)

inventories <- dbGetQuery(con,
  "select * from inventories
   where inventory_major_category_id =
     (select major_category_id from major_categories
      where lower(major_category_name) = 'wine')
   order by inventory_date desc")

ui <- dashboardPage(
  skin = color,
  dashboardHeader(title = "Inventory Analysis"),
  dashboardSidebar(
    selectInput("startDate", "Starting Date", inventories$inventory_date,
                selected = inventories$inventory_date[2]),
    selectInput("endDate", "Ending Date", inventories$inventory_date)
  ),
  dashboardBody(
    shinyjs::useShinyjs(),
    tabsetPanel(id = "tabSet",
      tabPanel("Summary",
        fluidPage(
          fluidRow(
            column(4, valueBoxOutput("begInvOutput",    width = 10)),
            column(4, valueBoxOutput("endInvOutput",    width = 10)),
            column(4, valueBoxOutput("invChangeOutput", width = 10))
          ),
          fluidRow(
            column(4, valueBoxOutput("begInvVarOutput", width = 10)),
            column(4, valueBoxOutput("endInvVarOutput", width = 10)),
            column(4, valueBoxOutput("purchaseOutput",  width = 10))
          ),
          fluidRow(
            column(4, valueBoxOutput("glSalesOutput",  width = 10)),
            column(4, valueBoxOutput("btlSalesOutput", width = 10)),
            column(4, valueBoxOutput("salesOutput",    width = 10))
          ),
          fluidRow(
            column(4, valueBoxOutput("cosOutput",         width = 10)),
            column(4, valueBoxOutput("costPercentOutput", width = 10)),
            column(4, valueBoxOutput("profitOutput",      width = 10))
          ),
          fluidRow(plotOutput("invTrendPlot"), width = "100%")
        )
      ),
      tabPanel("Beg. Inv.",     DT::dataTableOutput("begInvTable")),
      tabPanel("End. Inv.",     DT::dataTableOutput("endInvTable")),
      tabPanel("Sales",         DT::dataTableOutput("salesTable")),
      tabPanel("Purch.",        DT::dataTableOutput("purchasesTable")),
      tabPanel("Beg. Inv. Var.", DT::dataTableOutput("begInvVarTable")),
      tabPanel("End. Inv. Var.", DT::dataTableOutput("endInvVarTable"))
    )
  )
)

server <- function(input, output, session) {

  getInventoryQuery <- "select
    pi.inventory_name, r.room_name,
    pila.location_column, pila.location_row,
    id.quantity_counted, id.theoretical_quantity,
    id.product_cost, round(id.product_cost * id.quantity_counted, 2) as ext
    from inventories i, inventory_details id,
    product_instances pi, product_instance_location_associations pila, rooms r
    where i.inventory_id = id.inventory_id
    and id.product_instance_location_id = pila.product_instance_location_id
    and pila.product_instance_id = pi.product_instance_id
    and pila.location_room_id = r.room_id
    and inventory_date = ($1)
    and i.inventory_major_category_id =
      (select major_category_id from major_categories
       where lower(major_category_name) = 'wine')
    order by room_name, location_column, location_row, inventory_name"

  getSalesQuery <- "select pi.inventory_name,
    gia.average_sales_unit_cost as unit_cost,
    gia.bottle_sales as btl_sales, gia.bottle_sales_extended as btl_sales_ext,
    case when gia.bottle_sales = 0 or gia.bottle_sales_extended = 0 then NULL
         else round(gia.average_sales_unit_cost / (gia.bottle_sales_extended / gia.bottle_sales), 2)
    end as btl_cost_percent,
    gia.glass_sales as gl_sales, gia.glass_sales_extended as gl_sales_ext,
    case when gia.glass_sales = 0 or gia.glass_sales_extended = 0 then NULL
         else round(gia.average_sales_unit_cost / (gia.glass_sales_extended / gia.glass_sales), 2)
    end as gls_cost_percent,
    coalesce(gia.bottle_sales, 0) + coalesce(gia.glass_sales, 0) as total_sales,
    coalesce(gia.bottle_sales_extended, 0) + coalesce(gia.glass_sales_extended, 0) as total_sales_ext,
    case when coalesce(gia.glass_sales_extended, 0) + coalesce(gia.bottle_sales_extended, 0) = 0 then null
         else round(
           (gia.glass_sales * gia.average_sales_unit_cost + gia.bottle_sales * gia.average_sales_unit_cost) /
           (coalesce(gia.glass_sales_extended, 0) + coalesce(gia.bottle_sales_extended, 0)), 2)
    end as cost_percent
    from get_inventory_activity($1, $2) gia, product_instances pi, products p
    where pi.product_instance_id = gia.product_instance_id
    and pi.product_id = p.product_id
    and p.major_category_id =
      (select major_category_id from major_categories
       where lower(major_category_name) = 'wine')
    and (gia.glass_sales > 0 or gia.bottle_sales > 0)
    order by inventory_name"

  getPurchQuery <- "select
    pi.inventory_name, c.company_name, i.vendor_invoice_id,
    i.invoice_date, i.payment_date, id.number_received,
    id.price_per_unit, round(id.number_received * id.price_per_unit, 2) as ext
    from invoices i, invoice_details id, product_instances pi,
    companies c, products p, product_instance_location_associations pila
    where i.invoice_id = id.invoice_id
    and id.product_instance_location_id = pila.product_instance_location_id
    and pila.product_instance_id = pi.product_instance_id
    and i.vendor_company_id = c.company_id
    and p.product_id = pi.product_id
    and p.major_category_id =
      (select major_category_id from major_categories
       where lower(major_category_name) = 'wine')
    and i.payment_date > ($1)
    and payment_date <= ($2)
    order by company_name, vendor_invoice_id"

  getInvTotalsQuery <- "select inventory_date,
    coalesce(sum(quantity_counted * product_cost) / 1000000, 0) as inv_total_mil
    from inventories i, inventory_details id
    where i.inventory_id = id.inventory_id
    and i.inventory_major_category_id =
      (select major_category_id from major_categories
       where lower(major_category_name) = 'wine')
    and i.inventory_date between ($1) and ($2)
    group by inventory_date"

  makeVarTable <- function(invData) {
    invData %>%
      filter(quantity_counted != theoretical_quantity) %>%
      mutate(
        var = round(quantity_counted - theoretical_quantity, 1),
        ext = round(product_cost * var, 2)
      ) %>%
      select(inventory_name, quantity_counted, theoretical_quantity, product_cost, var, ext) %>%
      group_by(inventory_name) %>%
      summarize(
        total_counted = sum(quantity_counted),
        p_cost        = mean(product_cost),
        total_theo    = sum(theoretical_quantity),
        total_var     = sum(var),
        total_ext     = sum(ext)
      ) %>%
      mutate(total_abs_ext = abs(total_ext)) %>%
      filter(total_var != 0) %>%
      arrange(total_ext)
  }

  dtOpts <- list(
    pageLength = -1,
    lengthMenu = list(c(20, 50, 100, -1), c("20", "50", "100", "All")),
    lengthChange = TRUE,
    dom = "Bfrtip",
    buttons = c("pageLength", "copy", "csv", "excel", "pdf", "print")
  )

  observe({
    startdate <- input$startDate
    enddate   <- input$endDate

    # Support URL query string to pre-select dates and collapse sidebar
    query <- parseQueryString(session$clientData$url_search)
    if (!is.null(query$startdate) && !is.null(query$enddate)) {
      startdate <- query$startdate
      enddate   <- query$enddate
      shinyjs::addClass(selector = "body", class = "sidebar-collapse")
    }

    begInvData    <- dbGetQuery(con, getInventoryQuery, list(startdate))
    endInvData    <- dbGetQuery(con, getInventoryQuery, list(enddate))
    salesData     <- dbGetQuery(con, getSalesQuery, list(as.character(as.Date(startdate) + 1), enddate))
    purchasesData <- dbGetQuery(con, getPurchQuery, list(startdate, enddate))
    invTotalsData <- dbGetQuery(con, getInvTotalsQuery, list(startdate, enddate))

    begInvVarData <- makeVarTable(begInvData)
    endInvVarData <- makeVarTable(endInvData)

    # Tables
    output$begInvTable    <- DT::renderDataTable(datatable(begInvData,    rownames = FALSE, extensions = "Buttons", filter = "top", options = dtOpts) %>% formatCurrency(c("ext", "product_cost"), "$"))
    output$endInvTable    <- DT::renderDataTable(datatable(endInvData,    rownames = FALSE, extensions = "Buttons", filter = "top", options = dtOpts) %>% formatCurrency(c("ext", "product_cost"), "$"))
    output$salesTable     <- DT::renderDataTable(datatable(salesData,     rownames = FALSE, extensions = "Buttons", filter = "top", options = dtOpts))
    output$purchasesTable <- DT::renderDataTable(datatable(purchasesData, rownames = FALSE, extensions = "Buttons", filter = "top", options = dtOpts))
    output$begInvVarTable <- DT::renderDataTable(datatable(begInvVarData, rownames = FALSE, extensions = "Buttons", filter = "top", options = dtOpts) %>% formatRound("total_var", 1) %>% formatCurrency(c("total_ext", "total_abs_ext", "p_cost"), "$"))
    output$endInvVarTable <- DT::renderDataTable(datatable(endInvVarData, rownames = FALSE, extensions = "Buttons", filter = "top", options = dtOpts) %>% formatRound("total_var", 1) %>% formatCurrency(c("total_ext", "total_abs_ext", "p_cost"), "$"))

    # Trend plot
    output$invTrendPlot <- renderPlot({
      plot(invTotalsData, type = "p", pch = 20,
           ylab = "Inventory Total ($M)", xlab = "Inventory Date",
           main = "Inventory Trend")
    })

    # Summary value boxes
    beg_ext    <- sum(begInvData$ext)
    end_ext    <- sum(endInvData$ext)
    purch_ext  <- sum(purchasesData$ext, na.rm = TRUE)
    sales_ext  <- sum(salesData$btl_sales_ext) + sum(salesData$gl_sales_ext)
    cos        <- beg_ext - end_ext + purch_ext

    vbox <- function(value, title, icon_name) {
      valueBox(formatC(value, format = "f", big.mark = ",", digits = 2),
               title, icon = icon(icon_name, lib = "font-awesome"), color = "green")
    }

    output$begInvOutput    <- renderValueBox(vbox(beg_ext,                     "Beginning Inventory",          "dollar-sign"))
    output$endInvOutput    <- renderValueBox(vbox(end_ext,                     "Ending Inventory",             "dollar-sign"))
    output$invChangeOutput <- renderValueBox(vbox(end_ext - beg_ext,           "Inventory Change",             "dollar-sign"))
    output$begInvVarOutput <- renderValueBox(vbox(sum(begInvVarData$total_ext),"Beginning Inventory Variance", "dollar-sign"))
    output$endInvVarOutput <- renderValueBox(vbox(sum(endInvVarData$total_ext),"Ending Inventory Variance",    "dollar-sign"))
    output$purchaseOutput  <- renderValueBox(vbox(purch_ext,                   "Period Purchases",             "dollar-sign"))
    output$glSalesOutput   <- renderValueBox(vbox(sum(salesData$gl_sales_ext), "Period Glass Sales",           "dollar-sign"))
    output$btlSalesOutput  <- renderValueBox(vbox(sum(salesData$btl_sales_ext),"Period Bottle Sales",          "dollar-sign"))
    output$salesOutput     <- renderValueBox(vbox(sales_ext,                   "Total Period Sales",           "dollar-sign"))
    output$cosOutput       <- renderValueBox(vbox(cos,                         "Cost of Sales",                "dollar-sign"))
    output$costPercentOutput <- renderValueBox(
      valueBox(round(100 * cos / sales_ext, 2), "Wine Cost %",
               icon = icon("percentage", lib = "font-awesome"), color = "green"))
    output$profitOutput    <- renderValueBox(vbox(sales_ext - cos, "Profit", "dollar-sign"))
  })
}

shinyApp(ui, server)
