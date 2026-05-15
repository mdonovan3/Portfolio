library(RPostgres)
library(DBI)
library(tidyverse)
library(gt)
library(gtExtras)

db      <- Sys.getenv("db_name")
db_host <- Sys.getenv("db_host")
db_port <- "5432"
db_user <- Sys.getenv("db_user")
db_pass <- Sys.getenv("db_pass")
con <- dbConnect(RPostgres::Postgres(), dbname = db, host = db_host, port = db_port, user = db_user, password = db_pass)

ACTIVE_ONLY <- TRUE

# Pull the two most recent inventory dates to define the variance period
inv_dates <- dbGetQuery(con, "select * from inventories order by inventory_date desc limit 2")

start_inv_date <- as.Date(inv_dates$inventory_date[2])
end_inv_date   <- inv_dates$inventory_date[1]

# Activity starts the day after the opening count
inv_activity <- dbGetQuery(con,
  "select * from get_inventory_activity($1, $2)",
  list(start_inv_date + 1, end_inv_date)
)

inv_count_query <- "select i.*, id.*, pi.inventory_name, pi.active
  from inventories i, inventory_details id, product_instances pi
  where i.inventory_id = id.inventory_id
  and pi.product_instance_id = id.product_instance_id
  and i.inventory_date = $1"

start_inv_count <- dbGetQuery(con, inv_count_query, list(start_inv_date)) %>%
  select(active, product_instance_id, product_instance_location_id,
         inventory_name, theoretical_quantity, quantity_counted, product_cost) %>%
  filter(active == ACTIVE_ONLY) %>%
  mutate(extended = product_cost * quantity_counted)

end_inv_count <- dbGetQuery(con, inv_count_query, list(end_inv_date)) %>%
  select(active, product_instance_id, product_instance_location_id,
         inventory_name, theoretical_quantity, quantity_counted, product_cost) %>%
  filter(active == ACTIVE_ONLY) %>%
  mutate(extended = product_cost * quantity_counted)

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
  select(-c(transfers_from, transfers_to, purchases_extended, average_sales_unit_cost,
            glass_sales_extended, bottle_sales_extended, product_instance_location_id)) %>%
  mutate(across(c(glass_sales, bottle_sales, purchases), ~ ifelse(is.na(.), 0, .))) %>%
  group_by(product_instance_id) %>%
  summarize(
    glass_sales  = sum(glass_sales),
    bottle_sales = sum(bottle_sales),
    purchases    = sum(purchases)
  )

# variance = opening + purchases - glass - bottle - closing
variance_df <- full_join(si, ei, by = "product_instance_id") %>%
  mutate(inventory_name.x = ifelse(is.na(inventory_name.x), inventory_name.y, inventory_name.x)) %>%
  mutate(start_count       = ifelse(is.na(start_count), 0, start_count)) %>%
  mutate(end_count         = ifelse(is.na(start_count), 0, end_count))

variance_df <- left_join(variance_df, ia, by = "product_instance_id") %>%
  mutate(across(c(glass_sales, bottle_sales, purchases), ~ ifelse(is.na(.), 0, .))) %>%
  select(-inventory_name.y) %>%
  mutate(variance     = start_count + purchases - glass_sales - bottle_sales - end_count) %>%
  mutate(variance_ext = variance * product_cost.y) %>%
  filter(variance != 0) %>%
  arrange(desc(abs(variance_ext)))

variance_df <- variance_df %>%
  ungroup() %>%
  select(-product_instance_id) %>%
  rename(
    product_instance = inventory_name.x,
    start_inv_cost   = product_cost.x,
    end_inv_cost     = product_cost.y
  ) %>%
  filter(abs(variance) != 0) %>%
  filter(glass_sales == 0)

print(sum(variance_df$variance_ext))

dbDisconnect(con)
