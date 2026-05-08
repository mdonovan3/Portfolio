library(shiny)
library(shinydashboard)
library(dplyr)
library(DT)
library(DBI)
library(RPostgres)

# Wine Storage Pull Report — daily restock list showing bottles to pull from
# storage to service locations.
#
# Joins product_instance_location_associations with get_theoreticals_active_
# product_instances_only() to compute room par vs. theoretical on-hand,
# then caps the pull quantity against available storage_on_hand so you never
# pull more than exists. Rows with stock <= 0 are filtered (already stocked).
#
# Credentials loaded from .Renviron: DB_HOST, DB_PORT, DB_USER, DB_PASS, WINE_DB

ui <- dashboardPage(
  dashboardHeader(title = "Restock Report"),
  dashboardSidebar(collapsed = TRUE),
  dashboardBody(
    fluidPage(
      column(9, DT::dataTableOutput("salesTable"))
    )
  )
)

server <- function(input, output) {

  locationQuery <- "
    select pila.product_instance_location_id,
           pi.wine_list_bin_number as wl_num,
           pi.inventory_name as wine,
           r.room_name,
           pila.location_column as column,
           pila.location_row as row,
           r.room_par,
           bs.bottle_size
    from product_instances pi, rooms r, products p,
         product_instance_location_associations pila, bottle_sizes bs
    where pila.product_instance_id = pi.product_instance_id
      and pila.location_room_id = r.room_id
      and p.product_id = pi.product_id
      and pi.bottle_size_id = bs.bottle_size_id
      and pila.active_location = true
      and pi.active = true
      and r.room_par is not null
      and p.major_category_id =
          (select major_category_id from major_categories
           where lower(major_category_name) = 'wine')
    order by room_name, location_column, location_row"

  serviceTheoQuery <- "
    select product_instance_location_id,
           product_instance_id as pid,
           theoretical_on_hand as on_hand
    from get_theoreticals_active_product_instances_only($1)
    where product_instance_id in (
      select pila.product_instance_id
      from product_instance_location_associations pila, rooms r
      where pila.location_room_id = r.room_id
        and r.is_storage != true
        and pila.active_location = true)"

  storageTheoQuery <- "
    select product_instance_id as pid,
           sum(coalesce(theoretical_on_hand, 0)) as storage_on_hand
    from get_theoreticals_active_product_instances_only($1)
    where product_instance_location_id in (
      select pila.product_instance_location_id
      from product_instance_location_associations pila, rooms r
      where pila.location_room_id = r.room_id
        and r.is_storage = true
        and pila.active_location = true)
    group by product_instance_id"

  storageLocQuery <- "
    select distinct pila.product_instance_id as pid,
           max(location_row) as storage_loc
    from product_instance_location_associations pila, rooms r
    where pila.location_room_id = r.room_id
      and r.is_storage = true
      and pila.active_location = true
    group by pila.product_instance_id"

  con <- dbConnect(
    RPostgres::Postgres(),
    dbname   = Sys.getenv("WINE_DB"),
    host     = Sys.getenv("DB_HOST"),
    port     = Sys.getenv("DB_PORT"),
    user     = Sys.getenv("DB_USER"),
    password = Sys.getenv("DB_PASS")
  )

  observe({
    locationData <- dbGetQuery(con, locationQuery)
    theoData     <- dbGetQuery(con, serviceTheoQuery, list(Sys.Date()))
    storageData  <- dbGetQuery(con, storageTheoQuery, list(Sys.Date()))
    storageLocs  <- dbGetQuery(con, storageLocQuery)

    pullList <- locationData %>%
      merge(theoData,    by = "product_instance_location_id") %>%
      merge(storageData, by = "pid") %>%
      merge(storageLocs, by = "pid") %>%
      arrange(storage_loc) %>%
      mutate(
        room_par = case_when(bottle_size > 750 & room_par == 6 ~ as.integer(3),
                             TRUE ~ room_par),
        stock = case_when(
          room_par - on_hand <= storage_on_hand ~ room_par - on_hand,
          room_par - on_hand >  storage_on_hand ~ storage_on_hand)
      ) %>%
      select(wl_num, wine, room_name, row, room_par,
             on_hand, storage_on_hand, stock, storage_loc) %>%
      filter(stock > 0)

    output$salesTable <- DT::renderDataTable(
      datatable(pullList, rownames = FALSE, extensions = "Buttons",
                filter = "top", options = list(
                  columnDefs = list(list(width = "40px", targets = c(0,2,3,4,5,6,7,8))),
                  pageLength = -1,
                  lengthMenu = list(c(20, 50, 100, -1), c("20", "50", "100", "All")),
                  lengthChange = TRUE,
                  dom = "Bfrtip",
                  buttons = c("pageLength", "copy", "csv", "excel", "pdf", "print"))))
  })
}

shinyApp(ui = ui, server = server)
