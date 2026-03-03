library(shiny)
library(shinydashboard)
library(dplyr)
library(DT)
library(DBI)
library(RPostgreSQL)
library(stringr)
library(shinyjs)

# FIXED: all credentials moved to .Renviron -- add these entries:
#   db_name=brg_wine          # or bones_wine
#   db_host=blueridgegrill.cxond9zlkmhk.us-east-1.rds.amazonaws.com
#   db_port=5432
#   db_user=read_only
#   db_pass=<password>
db    <- Sys.getenv("db_name")
color <- if (db == "bones_wine") "red" else "blue"

con <- dbConnect(
  RPostgres::Postgres(),
  dbname   = db,
  host     = Sys.getenv("db_host"),
  port     = Sys.getenv("db_port"),
  user     = Sys.getenv("db_user"),
  password = Sys.getenv("db_pass")
)

getInventoriesQuery <-
  "select * from inventories
   where inventory_major_category_id = (
     select major_category_id from major_categories
     where lower(major_category_name) = 'wine'
   )
   order by inventory_date desc"

inventories <- dbGetQuery(con, getInventoriesQuery)

# ---------------------------------------------------------------------------
# UI
# ---------------------------------------------------------------------------
ui <- dashboardPage(
  skin = color,
  dashboardHeader(title = "Inventory Analysis"),
  dashboardSidebar(
    selectInput("startDate", "Starting Date",
                inventories$inventory_date,
                selected = inventories$inventory_date[2]),
    selectInput("endDate", "Ending Date",
                inventories$inventory_date)
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
            column(4, valueBoxOutput("glSalesOutput",   width = 10)),
            column(4, valueBoxOutput("btlSalesOutput",  width = 10)),
            column(4, valueBoxOutput("salesOutput",     width = 10))
          ),
          fluidRow(
            column(4, valueBoxOutput("cosOutput",         width = 10)),
            column(4, valueBoxOutput("costPercentOutput", width = 10)),
            column(4, valueBoxOutput("profitOutput",      width = 10))
          ),
          fluidRow(plotOutput("invTrendPlot"), width = "100%", height = "400px")
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

# ---------------------------------------------------------------------------
# Queries
# ---------------------------------------------------------------------------
getInventoryQuery <-
  "select
   pi.inventory_name, r.room_name,
   pila.location_column, pila.location_row,
   id.quantity_counted, id.theoretical_quantity,
   id.product_cost,
   round(id.product_cost * id.quantity_counted, 2) as ext
   from inventories i, inventory_details id,
   product_instances pi, product_instance_location_associations pila,
   rooms r
   where i.inventory_id = id.inventory_id
   and id.product_instance_location_id = pila.product_instance_location_id
   and pila.product_instance_id = pi.product_instance_id
   and pila.location_room_id = r.room_id
   and inventory_date = ($1)
   and i.inventory_major_category_id = (
     select major_category_id from major_categories
     where lower(major_category_name) = 'wine'
   )
   order by room_name, location_column, location_row, inventory_name"

getSalesQuery <-
  "select pi.inventory_name,
   gia.average_sales_unit_cost as unit_cost,
   gia.bottle_sales as btl_sales,
   gia.bottle_sales_extended as btl_sales_ext,
   case when gia.bottle_sales = 0 then NULL
        when gia.bottle_sales_extended = 0 then NULL
        else round(gia.average_sales_unit_cost / (gia.bottle_sales_extended / gia.bottle_sales), 2)
   end as btl_cost_percent,
   gia.glass_sales as gl_sales,
   gia.glass_sales_extended as gl_sales_ext,
   case when gia.glass_sales = 0 then NULL
        when gia.glass_sales_extended = 0 then NULL
        else round(gia.average_sales_unit_cost / (gia.glass_sales_extended / gia.glass_sales), 2)
   end as gls_cost_percent,
   coalesce(gia.bottle_sales, 0) + coalesce(gia.glass_sales, 0) as total_sales,
   coalesce(gia.bottle_sales_extended, 0) + coalesce(gia.glass_sales_extended, 0) as total_sales_ext,
   case when coalesce(gia.glass_sales_extended, 0) + coalesce(gia.bottle_sales_extended, 0) = 0 then null
        else round(
          (gia.glass_sales * gia.average_sales_unit_cost + gia.bottle_sales * gia.average_sales_unit_cost) /
          (coalesce(gia.glass_sales_extended, 0) + coalesce(gia.bottle_sales_extended, 0)), 2)
   end as cost_percent
   from get_inventory_activity($1, $2) gia,
   product_instances pi,
   products p
   where pi.product_instance_id = gia.product_instance_id
   and pi.product_id = p.product_id
   and p.major_category_id = (
     select major_category_id from major_categories
     where lower(major_category_name) = 'wine'
   )
   and (gia.glass_sales > 0 or gia.bottle_sales > 0)
   order by inventory_name"

getPurchQuery <-
  "select
   pi.inventory_name,
   c.company_name, i.vendor_invoice_id,
   i.invoice_date, i.payment_date, id.number_received,
   id.price_per_unit,
   round(id.number_received * id.price_per_unit, 2) as ext
   from invoices i, invoice_details id,
   product_instances pi, companies c,
   products p,
   product_instance_location_associations pila
   where i.invoice_id = id.invoice_id
   and id.product_instance_location_id = pila.product_instance_location_id
   and pila.product_instance_id = pi.product_instance_id
   and i.vendor_company_id = c.company_id
   and p.product_id = pi.product_id
   and p.major_category_id = (
     select major_category_id from major_categories
     where lower(major_category_name) = 'wine'
   )
   and i.payment_date > ($1)
   and payment_date <= ($2)
   order by company_name, vendor_invoice_id"

getInvTotalsQuery <-
  "select inventory_date,
   coalesce(sum(quantity_counted * product_cost) / 1000000, 0) as inv_total_hun_thousand
   from inventories i, inventory_details id
   where i.inventory_id = id.inventory_id
   and i.inventory_major_category_id = (
     select major_category_id from major_categories
     where lower(major_category_name) = 'wine'
   )
   and i.inventory_date between ($1) and ($2)
   group by inventory_date"

# ---------------------------------------------------------------------------
# Helper: build a standard DT datatable
# ---------------------------------------------------------------------------
makeDataTable <- function(data) {
  datatable(data,
    rownames   = FALSE,
    extensions = "Buttons",
    filter     = "top",
    options    = list(
      pageLength = -1,
      lengthMenu = list(c(20, 50, 100, -1), c("20", "50", "100", "All")),
      lengthChange = TRUE,
      dom     = "Bfrtip",
      buttons = c("pageLength", "copy", "csv", "excel", "pdf", "print")
    )
  )
}

# ---------------------------------------------------------------------------
# Helper: compute variance summary from an inventory detail data frame
# ---------------------------------------------------------------------------
computeVarData <- function(invData) {
  invData[invData$quantity_counted != invData$theoretical_quantity, ] %>%
    mutate(
      var = round(quantity_counted - theoretical_quantity, digits = 1),
      ext = round(product_cost * var, digits = 2)
    ) %>%
    select(inventory_name, quantity_counted, theoretical_quantity,
           product_cost, var, ext) %>%
    group_by(inventory_name) %>%
    summarize(
      total_counted = sum(quantity_counted),
      p_cost        = mean(product_cost),
      total_theo    = sum(theoretical_quantity),
      total_var     = sum(var),
      total_ext     = sum(ext),
      .groups       = "drop"
    ) %>%
    mutate(total_abs_ext = abs(total_ext)) %>%
    filter(total_var != 0) %>%
    arrange(total_ext)
}

# ---------------------------------------------------------------------------
# Server
# ---------------------------------------------------------------------------
server <- function(input, output, session) {

  # FIXED: moved all reactive data fetching into reactive() expressions so
  # each query only re-runs when its specific inputs change, not on every input change

  startdate <- reactive({
    query <- parseQueryString(session$clientData$url_search)
    if (!is.null(query$startdate)) {
      shinyjs::addClass(selector = "body", class = "sidebar-collapse")
      query$startdate
    } else {
      input$startDate
    }
  })

  enddate <- reactive({
    query <- parseQueryString(session$clientData$url_search)
    if (!is.null(query$enddate)) query$enddate else input$endDate
  })

  begInvData    <- reactive({ dbGetQuery(con, getInventoryQuery, list(startdate())) })
  endInvData    <- reactive({ dbGetQuery(con, getInventoryQuery, list(enddate())) })
  salesData     <- reactive({ dbGetQuery(con, getSalesQuery,     list(as.character(as.Date(startdate()) + 1), enddate())) })
  purchasesData <- reactive({ dbGetQuery(con, getPurchQuery,     list(startdate(), enddate())) })
  invTotalsData <- reactive({ dbGetQuery(con, getInvTotalsQuery, list(startdate(), enddate())) })

  begInvVarData <- reactive({ computeVarData(begInvData()) })
  endInvVarData <- reactive({ computeVarData(endInvData()) })

  # --- Tables -----------------------------------------------------------------
  output$begInvTable <- DT::renderDataTable(
    makeDataTable(begInvData()) %>% formatCurrency(c("ext", "product_cost"), "$"))

  output$endInvTable <- DT::renderDataTable(
    makeDataTable(endInvData()) %>% formatCurrency(c("ext", "product_cost"), "$"))

  output$salesTable <- DT::renderDataTable(
    makeDataTable(salesData()))

  output$purchasesTable <- DT::renderDataTable(
    makeDataTable(purchasesData()))

  output$begInvVarTable <- DT::renderDataTable(
    makeDataTable(begInvVarData()) %>%
      formatRound("total_var", digits = 1) %>%
      formatCurrency(c("total_ext", "total_abs_ext", "p_cost"), "$"))

  output$endInvVarTable <- DT::renderDataTable(
    makeDataTable(endInvVarData()) %>%
      formatRound("total_var", digits = 1) %>%
      formatCurrency(c("total_ext", "total_abs_ext", "p_cost"), "$"))

  # --- Trend plot -------------------------------------------------------------
  # FIXED: removed input$newplot reference (nonexistent button); plot now
  # re-renders reactively when date inputs change
  output$invTrendPlot <- renderPlot({
    plot(invTotalsData(),
         type = "p",
         ylab = "Inventory Total",
         xlab = "Inventory Date",
         main = "Inventory Trend ($M)",
         pch  = 20)
  })

  # --- Value boxes ------------------------------------------------------------
  output$cosOutput <- renderValueBox({
    cos <- sum(begInvData()$ext) - sum(endInvData()$ext) + sum(purchasesData()$ext, na.rm = TRUE)
    valueBox(formatC(cos, format = "f", big.mark = ",", digits = 2),
             "Cost of Sales", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$costPercentOutput <- renderValueBox({
    cos        <- sum(begInvData()$ext) - sum(endInvData()$ext) + sum(purchasesData()$ext, na.rm = TRUE)
    total_sales <- sum(salesData()$btl_sales_ext) + sum(salesData()$gl_sales_ext)
    valueBox(round(100 * cos / total_sales, 2),
             "Wine Cost Percentage", icon = icon("percentage", lib = "font-awesome"), color = "green")
  })

  output$profitOutput <- renderValueBox({
    cos        <- sum(begInvData()$ext) - sum(endInvData()$ext) + sum(purchasesData()$ext, na.rm = TRUE)
    total_sales <- sum(salesData()$btl_sales_ext) + sum(salesData()$gl_sales_ext)
    valueBox(formatC(total_sales - cos, format = "f", big.mark = ",", digits = 2),
             "Profit", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$invChangeOutput <- renderValueBox({
    valueBox(formatC(sum(endInvData()$ext) - sum(begInvData()$ext), format = "f", big.mark = ",", digits = 2),
             "Inventory Change", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$begInvOutput <- renderValueBox({
    valueBox(formatC(sum(begInvData()$ext), format = "f", big.mark = ",", digits = 2),
             "Beginning Inventory", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$endInvOutput <- renderValueBox({
    valueBox(formatC(sum(endInvData()$ext), format = "f", big.mark = ",", digits = 2),
             "Ending Inventory", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$begInvVarOutput <- renderValueBox({
    valueBox(formatC(sum(begInvVarData()$total_ext), format = "f", big.mark = ",", digits = 2),
             "Beginning Inventory Variance", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$endInvVarOutput <- renderValueBox({
    valueBox(formatC(sum(endInvVarData()$total_ext), format = "f", big.mark = ",", digits = 2),
             "Ending Inventory Variance", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$salesOutput <- renderValueBox({
    valueBox(formatC(sum(salesData()$btl_sales_ext) + sum(salesData()$gl_sales_ext), format = "f", big.mark = ",", digits = 2),
             "Total Inventory Period Sales", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$glSalesOutput <- renderValueBox({
    valueBox(formatC(sum(salesData()$gl_sales_ext), format = "f", big.mark = ",", digits = 2),
             "Inventory Period Glass Sales", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$btlSalesOutput <- renderValueBox({
    valueBox(formatC(sum(salesData()$btl_sales_ext), format = "f", big.mark = ",", digits = 2),
             "Inventory Period Bottle Sales", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })

  output$purchaseOutput <- renderValueBox({
    valueBox(formatC(sum(purchasesData()$ext, na.rm = TRUE), format = "f", big.mark = ",", digits = 2),
             "Inventory Period Purchases", icon = icon("dollar-sign", lib = "font-awesome"), color = "green")
  })
}

shinyApp(ui = ui, server = server)
