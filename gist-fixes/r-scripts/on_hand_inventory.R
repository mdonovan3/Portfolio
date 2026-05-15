library(dplyr)
library(DBI)
library(RPostgreSQL)
library(tidyverse)
library(DBI)
library(gt)
library(purrr)
library(scales)

WASTE_PERCENT <- .1

db      <- ""
db_host <- ""
db_port <- "5432"
db_user <- ""
db_pass <- ""
con <- dbConnect(RPostgres::Postgres(), dbname = db, host = db_host, port = db_port, user = db_user, password = db_pass)

query1 <- "select product_instance_id, inventory_name, unit_price, active from product_instances"
query2 <- "select * from get_theoreticals_active_product_instances_only( $1 )"

costs    <- dbGetQuery(con, query1)
theoData <- dbGetQuery(con, query2, list(Sys.Date()))

joined <- theoData %>%
  left_join(costs) %>%
  filter(active == TRUE) %>%
  mutate(extended         = theoretical_on_hand * unit_price) %>%
  mutate(adj_theoretical  = theoretical_on_hand - glass_sales * WASTE_PERCENT) %>%
  mutate(adj_extended     = adj_theoretical * unit_price) %>%
  select(-c(product_instance_id, product_instance_location_id, beginning_inventory)) %>%
  select(-c(bottle_sales, glass_sales, transfers_from, transfers_to, purchases)) %>%
  arrange(desc(extended)) %>%
  relocate(inventory_name, unit_price, theoretical_on_hand, extended)

inventory_total     <- sum(joined$extended)
adj_inventory_total <- sum(joined$adj_extended)

print("theoretical on hand");          print(inventory_total)
print("Theoretical minus glass waste"); print(adj_inventory_total)
print("probable waste amount to date since last count")
print(inventory_total - adj_inventory_total)


get_inventory_activity_by_day <- function(start_date, end_date) {
  inv_activity_df    <- tibble(.rows = 0)
  day_seq            <- seq.Date(from = as.Date(start_date), to = as.Date(end_date), by = "day")
  inv_activity_query <- "select
    sum(purchases * average_sales_unit_cost) - sum(glass_sales + bottle_sales * average_sales_unit_cost)
    as net_change
    from get_inventory_activity($1, $2)"
  for (day in day_seq) {
    day_activity <- dbGetQuery(con, inv_activity_query, list(
      as.Date(day, origin = "1970-01-01"),
      as.Date(day, origin = "1970-01-01")
    )) %>%
      mutate(activity_date = as.Date(day, origin = "1970-01-01"))
    inv_activity_df <- bind_rows(inv_activity_df, day_activity)
  }
  inv_activity_df %>%
    mutate(across(where(is.numeric), ~ replace_na(.x, 0)))
}

get_inventory_valuation <- function(inv_id) {
  dbGetQuery(con, "select sum(quantity_counted * product_cost) from inventory_details where inventory_id = $1", list(inv_id))
}

# Builds a daily time series of total wine inventory value from the perpetual inventory function.
# Slow — queries get_theoreticals_all() once per day; write to CSV and reload for subsequent use.
plot_inv_values <- function(start_date, end_date) {
  theoreticals_DF <- tibble(.rows = 0)
  wine_cat        <- dbGetQuery(con, "select major_category_id from major_categories where
                         upper(major_category_name) like '%WINE%'")
  product_costs   <- dbGetQuery(con, "select pi.product_instance_id,
                              pi.unit_price, p.major_category_id
                              from product_instances pi
                              left join products p on
                              (p.product_id = pi.product_id)")
  theo_query <- "select product_instance_id, sum(theoretical_on_hand) from
    get_theoreticals_all( $1 ) group by (product_instance_id)"
  date_seq <- seq.Date(as.Date(start_date, origin = "1970-01-01"),
    as.Date(end_date, origin = "1970-01-01"),
    by = "day"
  )
  for (day in date_seq) {
    day  <- as.Date(day, origin = "1970-01-01")
    theo <- dbGetQuery(con, theo_query, list(day)) %>%
      filter(sum != 0) %>%
      mutate(theo_date = day)
    theo <- left_join(theo, product_costs, by = c("product_instance_id" = "product_instance_id")) %>%
      filter(major_category_id == wine_cat$major_category_id) %>%
      select(-c(major_category_id)) %>%
      filter(!is.na(sum) & !is.na(unit_price)) %>%
      group_by(theo_date) %>%
      summarise(sum = sum(sum * unit_price))
    theoreticals_DF <- bind_rows(theoreticals_DF, theo)
  }
  theoreticals_DF
}

# CPI annual averages (BLS CPI-U, all items) — used to inflation-adjust historical inventory values
cpi_values <- c(
  `2008` = 215.303,
  `2009` = 214.537,
  `2010` = 218.056,
  `2011` = 224.939,
  `2012` = 229.594,
  `2013` = 232.957,
  `2014` = 236.736,
  `2015` = 237.017,
  `2016` = 240.007,
  `2017` = 245.120,
  `2018` = 251.107,
  `2019` = 255.657,
  `2020` = 258.811,
  `2021` = 270.970,
  `2022` = 292.655,
  `2023` = 304.702,
  `2024` = 313.689,
  `2025` = 323.976
)

# theoreticals_DF <- plot_inv_values(as.Date("2024-01-01"), as.Date("2024-12-31"))
# write_csv(theoreticals_DF, "theoreticals_2024.csv")

theoreticals_DF <- read.csv(file.choose()) %>%
  mutate(theo_date = as.Date(theo_date, origin = "1970-01-01")) %>%
  mutate(year = year(theo_date)) %>%
  mutate(inf_adj_value = sum * (cpi_values[as.character(year(Sys.Date()))]
  / cpi_values[as.character(year)]))


annual_means <- theoreticals_DF %>%
  mutate(year = year(theo_date)) %>%
  group_by(year(theo_date)) %>%
  summarise(annual_mean = mean(sum), .groups = "drop") %>%
  rename(year = "year(theo_date)")

draw_plot <- function() {
  theoreticals_DF %>%
    ggplot() +
    aes(x = theo_date, y = sum) +
    scale_x_date(date_breaks = "1 year", date_labels = "%Y") +
    scale_y_continuous(
      breaks = seq(0, 2500000, by = 100000),
      labels = dollar
    ) +
    geom_line() +
    geom_line(aes(y = inf_adj_value), color = "green") +
    geom_segment(
      data = annual_means,
      aes(
        x    = as.Date(paste0(year, "-01-01")),
        xend = as.Date(paste0(year, "-12-31")),
        y    = annual_mean, yend = annual_mean
      ),
      color = "red", size = 1
    ) +
    geom_smooth()
}

draw_plot()
