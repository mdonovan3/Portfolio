library(lubridate)
library(RPostgres)
library(DBI)
library(tidyverse)
library(gt)
library(gtExtras)


# estimates inventory purchases needed from current date
# through end of calendar year

db      <- ""
db_host <- ""
db_port <- "5432"
db_user <- ""
db_pass <- ""
con <- dbConnect(RPostgres::Postgres(), dbname = db, host = db_host, port = db_port, user = db_user, password = db_pass)

num_years        <- 1
sales_min_cutoff <- 12

start_date <- Sys.Date()
end_date   <- ceiling_date(start_date, "year") - days(1)


inv_activity_query <- "select ia.*, pi.product_id, pi.unit_price,
                      pi.inventory_name, p.product_name,
                      pi.bottle_size_id, bs.bottle_size
                      from get_inventory_activity($1, $2) ia
                      left join product_instances pi
                      on ia.product_instance_id = pi.product_instance_id
                      left join products p on
                      (p.product_id = pi.product_id)
                      left join bottle_sizes bs on (bs.bottle_size_id = pi.bottle_size_id)"

starting_inv_query <- "select id.*, pi.product_id, pi.bottle_size_id, pi.unit_price,
                                 bs.bottle_size, pi.inventory_name, p.product_name
                                 from inventory_details id
                                 left join product_instances pi on
                                 (id.product_instance_id = pi.product_instance_id)
                                 left join products p on
                                 (p.product_id = pi.product_id)
                                 left join bottle_sizes bs on (bs.bottle_size_id = pi.bottle_size_id)
                                 where inventory_id = $1"

last_inv <- dbGetQuery(con, "select inventory_id, inventory_date from inventories where inventory_date =
                            (select max(inventory_date) from inventories)")


starting_inventory <- dbGetQuery(con, starting_inv_query, list(last_inv$inventory_id))


inv_activity_since_last_inv <- dbGetQuery(
  con, inv_activity_query, list(last_inv$inventory_date + 1, Sys.Date())
)

inv_activity_since_last_inv_summarized <- inv_activity_since_last_inv %>%
  group_by(product_instance_id) %>%
  summarise(
    glass_sales  = sum(glass_sales),
    bottle_sales = sum(bottle_sales),
    purchases    = sum(purchases),
    product_id     = first(product_id),
    inventory_name = first(inventory_name),
    product_name   = first(product_name),
    bottle_size    = first(bottle_size),
    unit_price     = first(unit_price)
  )

starting_inventory_summarized <- starting_inventory %>%
  group_by(product_instance_id) %>%
  summarise(
    quantity_counted = sum(quantity_counted),
    product_id       = first(product_id),
    inventory_name   = first(inventory_name),
    product_name     = first(product_name),
    bottle_size      = first(bottle_size),
    unit_price       = first(unit_price)
  )

current_on_hand_inventory <- full_join(starting_inventory_summarized,
  inv_activity_since_last_inv_summarized,
  by = c("product_instance_id" = "product_instance_id")
) %>%
  mutate(across(where(is.numeric), ~ replace_na(.x, 0))) %>%
  mutate(on_hand      = quantity_counted + purchases - glass_sales - bottle_sales) %>%
  mutate(product_name = product_name.x) %>%
  rename(inventory_name = inventory_name.x) %>%
  rename(bottle_size    = bottle_size.x) %>%
  rename(product_id     = product_id.x) %>%
  rename(unit_price     = unit_price.x) %>%
  filter(!is.na(inventory_name)) %>%
  select(
    product_id, product_instance_id, inventory_name, on_hand, bottle_size,
    quantity_counted, purchases, glass_sales, bottle_sales, product_name, unit_price
  ) %>%
  arrange(desc(on_hand))


previous_year_inv_activity <- dbGetQuery(
  con, inv_activity_query,
  list(Sys.Date() - 365, ceiling_date(Sys.Date() - 365, "year") - days(1))
)

previous_year_inv_activity <- previous_year_inv_activity %>%
  mutate(total_sales = bottle_sales + glass_sales) %>%
  arrange(desc(total_sales)) %>%
  group_by(product_instance_id) %>%
  summarise(
    total_sales    = sum(total_sales),
    product_name   = first(product_name),
    inventory_name = first(inventory_name),
    bottle_sales   = sum(bottle_sales),
    glass_sales    = sum(glass_sales),
    bottle_size    = first(bottle_size),
    unit_price     = first(unit_price)
  ) %>%
  relocate(product_name, total_sales) %>%
  arrange(desc(total_sales)) %>%
  relocate(product_name)


wines_to_purchase <- left_join(current_on_hand_inventory, previous_year_inv_activity,
  by = c("product_instance_id" = "product_instance_id")
) %>%
  mutate(across(where(is.numeric), ~ replace_na(.x, 0))) %>%
  mutate(quantity_needed = ceiling(total_sales - on_hand)) %>%
  arrange(desc(quantity_needed)) %>%
  relocate(inventory_name.x, on_hand, total_sales, quantity_needed)

wtp_grouped_by_product <- wines_to_purchase %>%
  rename(product_name = product_name.x) %>%
  rename(bottle_size  = bottle_size.x) %>%
  rename(unit_price   = unit_price.x) %>%
  group_by(product_name, bottle_size) %>%
  mutate(product_name = paste(product_name, " ", bottle_size, "ml", sep = "")) %>%
  summarise(
    total_sales = sum(total_sales),
    on_hand     = sum(on_hand),
    unit_price  = round(mean(unit_price), 2)
  ) %>%
  mutate(quantity_needed       = ceiling(total_sales - on_hand)) %>%
  filter(total_sales > 10 & quantity_needed > 0) %>%
  mutate(increase_to_inventory = ceiling(sum(quantity_needed * unit_price))) %>%
  arrange(desc(increase_to_inventory)) %>%
  relocate(product_name, quantity_needed, increase_to_inventory) %>%
  ungroup()

wtp_grouped_by_product %>%
  gt() %>%
  gt_theme_538()

print(paste("total increase to inventory: $", wtp_grouped_by_product %>% select(increase_to_inventory) %>% sum(), sep = ""))

dbDisconnect(con)
