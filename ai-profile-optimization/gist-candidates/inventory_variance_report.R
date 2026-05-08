library(RPostgres)
library(DBI)
library(tidyverse)
library(gt)
library(gtExtras)

# Period-over-period inventory variance (shrinkage) report.
# Pulls the two most recent inventory counts, computes activity between them,
# and identifies bottle-level discrepancies unexplained by sales.
#
# variance = start_count + purchases - glass_sales - bottle_sales - end_count
# A non-zero variance on a bottle-only SKU (glass_sales == 0) is unexplained loss.
#
# Credentials loaded from .Renviron: DB_HOST, DB_PORT, DB_USER, DB_PASS

con <- dbConnect(
  RPostgres::Postgres(),
  dbname   = Sys.getenv("WINE_DB"),
  host     = Sys.getenv("DB_HOST"),
  port     = Sys.getenv("DB_PORT"),
  user     = Sys.getenv("DB_USER"),
  password = Sys.getenv("DB_PASS")
)

ACTIVE_ONLY <- TRUE

inv_dates <- dbGetQuery(con,
  "select * from inventories order by inventory_date desc limit 2")

start_inv_date <- as.Date(inv_dates$inventory_date[2])
end_inv_date   <- inv_dates$inventory_date[1]

inv_activity <- dbGetQuery(con,
  "select * from get_inventory_activity($1, $2)",
  list(start_inv_date + 1, end_inv_date))

inv_count_query <- "
  select i.*, id.*, pi.inventory_name, pi.active
  from inventories i, inventory_details id, product_instances pi
  where i.inventory_id = id.inventory_id
  and   pi.product_instance_id = id.product_instance_id
  and   i.inventory_date = $1"

start_inv_count <- dbGetQuery(con, inv_count_query, list(start_inv_date)) %>%
  select(active, product_instance_id, product_instance_location_id,
         inventory_name, theoretical_quantity, quantity_counted, product_cost) %>%
  filter(active == ACTIVE_ONLY)

end_inv_count <- dbGetQuery(con, inv_count_query, list(end_inv_date)) %>%
  select(active, product_instance_id, product_instance_location_id,
         inventory_name, theoretical_quantity, quantity_counted, product_cost) %>%
  filter(active == ACTIVE_ONLY)

si <- start_inv_count %>%
  select(-c(active, theoretical_quantity)) %>%
  group_by(product_instance_id, inventory_name, product_cost) %>%
  summarize(start_count = sum(quantity_counted)) %>%
  arrange(inventory_name)

ei <- end_inv_count %>%
  select(-c(active, theoretical_quantity)) %>%
  group_by(product_instance_id, inventory_name, product_cost) %>%
  summarize(end_count = sum(quantity_counted)) %>%
  arrange(inventory_name)

ia <- inv_activity %>%
  select(product_instance_id, glass_sales, bottle_sales, purchases) %>%
  mutate(across(c(glass_sales, bottle_sales, purchases), ~ ifelse(is.na(.), 0, .))) %>%
  group_by(product_instance_id) %>%
  summarize(
    glass_sales  = sum(glass_sales),
    bottle_sales = sum(bottle_sales),
    purchases    = sum(purchases)
  )

variance_df <- full_join(si, ei, by = "product_instance_id") %>%
  mutate(
    inventory_name.x = ifelse(is.na(inventory_name.x), inventory_name.y, inventory_name.x),
    start_count      = ifelse(is.na(start_count), 0, start_count),
    end_count        = ifelse(is.na(end_count),   0, end_count)
  ) %>%
  left_join(ia, by = "product_instance_id") %>%
  mutate(across(c(glass_sales, bottle_sales, purchases), ~ ifelse(is.na(.), 0, .))) %>%
  select(-inventory_name.y) %>%
  mutate(
    variance     = start_count + purchases - glass_sales - bottle_sales - end_count,
    variance_ext = variance * product_cost.y
  ) %>%
  filter(variance != 0) %>%
  arrange(desc(abs(variance_ext))) %>%
  ungroup() %>%
  select(-product_instance_id) %>%
  rename(
    product_instance = inventory_name.x,
    start_inv_cost   = product_cost.x,
    end_inv_cost     = product_cost.y
  ) %>%
  filter(abs(variance) != 0) %>%
  filter(glass_sales == 0)   # bottle-only: variance not attributable to glass pours

message("Total variance (extended): $", round(sum(variance_df$variance_ext), 2))

dbDisconnect(con)
