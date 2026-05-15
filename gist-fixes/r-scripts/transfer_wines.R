library(dplyr)
library(DBI)
library(RPostgreSQL)
library(DataEditR)
library(bslib)
library(rstudioapi)

custom_theme <- bs_theme(version = 3, bootswatch = "flatly")

db      <- Sys.getenv("db_name")
db_host <- Sys.getenv("db_host")
db_port <- "5432"
db_user <- Sys.getenv("db_user")
db_pass <- Sys.getenv("db_pass")
con <- dbConnect(RPostgres::Postgres(), dbname = db, host = db_host, port = db_port, user = db_user, password = db_pass)

# All active wine locations with room par and bottle size
locationQuery <- "select pila.product_instance_location_id,
  pi.wine_list_bin_number as wl_num,
  pi.inventory_name as wine,
  r.room_name,
  pila.location_column as column,
  pila.location_row  as row,
  r.room_par, bs.bottle_size
  from
  product_instances pi, rooms r, products p,
  product_instance_location_associations pila, bottle_sizes bs
  where pila.product_instance_id = pi.product_instance_id
  and pila.location_room_id = r.room_id
  and p.product_id = pi.product_id
  and pi.bottle_size_id = bs.bottle_size_id
  and pila.active_location = true
  and pi.active = true
  and r.room_par is not null
  and p.major_category_id = (
    select major_category_id from major_categories
    where lower(major_category_name) = 'wine'
  )
  order by room_name, location_column, location_row"

# Theoretical on-hand for floor (non-storage) locations only
floorTheoQuery <- "select product_instance_location_id, product_instance_id as pid,
  theoretical_on_hand as on_hand
  from get_theoreticals_active_product_instances_only( $1 )
  where product_instance_id in (
    select product_instance_id
    from product_instance_location_associations pila, rooms r
    where pila.location_room_id = r.room_id
    and r.is_storage != true
    and pila.active_location = true
  )"

# Theoretical on-hand for storage locations, summed per product instance
storageTheoQuery <- "select product_instance_id as pid,
  product_instance_location_id as storage_loc_id,
  sum(coalesce(theoretical_on_hand, 0)) as storage_on_hand
  from get_theoreticals_active_product_instances_only( $1 )
  where product_instance_location_id in (
    select pila.product_instance_location_id
    from product_instance_location_associations pila, rooms r
    where pila.location_room_id = r.room_id
    and r.is_storage = true
    and pila.active_location = true
  )
  group by product_instance_id, product_instance_location_id"

# Storage location row (for picking order)
storageLocQuery <- "select distinct pila.product_instance_id as pid,
  max(location_row) as storage_loc
  from product_instance_location_associations pila, rooms r
  where pila.location_room_id = r.room_id
  and r.is_storage = true
  and pila.active_location = true
  group by pila.product_instance_id"

locations  <- dbGetQuery(con, locationQuery)
floorTheo  <- dbGetQuery(con, floorTheoQuery, list(Sys.Date()))
storageTheo <- dbGetQuery(con, storageTheoQuery, list(Sys.Date()))
storageLocs <- dbGetQuery(con, storageLocQuery)

# Build pull list: stock = how many bottles can move from storage to floor
pullList <- locations %>%
  merge(floorTheo,   by = "product_instance_location_id") %>%
  merge(storageTheo, by = "pid") %>%
  merge(storageLocs, by = "pid") %>%
  arrange(storage_loc) %>%
  mutate(
    # Half-bottle par for large formats
    room_par = case_when(bottle_size > 750 & room_par == 6 ~ as.integer(3),
                         TRUE ~ room_par),
    # Can't pull more than what's in storage
    stock = case_when(
      room_par - on_hand <= storage_on_hand ~ room_par - on_hand,
      room_par - on_hand >  storage_on_hand ~ storage_on_hand
    )
  ) %>%
  select(wl_num, wine, room_name, product_instance_location_id, storage_loc_id,
         row, room_par, on_hand, storage_on_hand, stock, storage_loc) %>%
  rename(to_loc_id = product_instance_location_id) %>%
  filter(stock > 0) %>%
  arrange(room_name, storage_loc) %>%
  relocate(stock)

# Interactive edit — adjust quantities before committing
edited <- DataEditR::data_edit(
  pullList,
  theme = custom_theme,
  col_readonly = c("wl_num", "wine", "room_name", "to_loc_id",
                   "row", "room_par", "on_hand", "storage_on_hand", "storage_loc")
)

# Finalize and write transfers
edited <- edited %>%
  arrange(room_name, storage_loc) %>%
  rename(to_location   = to_loc_id,
         from_location = storage_loc_id,
         quantity      = stock) %>%
  mutate(transfer_date = Sys.Date()) %>%
  select(wine, to_location, from_location, quantity, transfer_date) %>%
  filter(quantity > 0)

insert_to_db <- function() {
  dbAppendTable(con, "product_instance_location_transfers",
                edited %>% select(-wine))
  dbDisconnect(con)
}
