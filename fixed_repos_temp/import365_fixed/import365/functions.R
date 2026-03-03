# FIXED: parameterized SQL (was string concatenation — SQL injection risk)
getEntityId <- function(alohaId, con) {
  df <- dbGetQuery(con, "select entity_id from entities where aloha_id = $1", params = list(alohaId))
  as.integer(df[1, 1])
}

# FIXED: db_host moved to .Renviron (was hardcoded)
# Add these to your .Renviron file:
#   db_host=blueridgegrill.cxond9zlkmhk.us-east-1.rds.amazonaws.com
#   db_port=5432
#   db_user=inventory
#   db_pass=<password>
getDBConnection <- function(db) {
  dbConnect(
    RPostgres::Postgres(),
    dbname   = db,
    host     = Sys.getenv("db_host"),
    port     = Sys.getenv("db_port"),
    user     = Sys.getenv("db_user"),
    password = Sys.getenv("db_pass")
  )
}

# FIXED: parameterized SQL (was string concatenation)
importExistsInDB <- function(date, entity, con) {
  df <- dbGetQuery(con,
    "select count(*) from pos_chkitems where date_of_sale = $1",
    params = list(date))
  df[[1]] > 0
}

importWineSales <- function(dataDir, majorId, minorId, db, test = FALSE) {
  con <- db

  bottleSizeDF      <- dbGetQuery(con, "select * from bottle_sizes")
  productLocationDF <- dbGetQuery(con,
    "select pila.product_instance_location_id, pila.product_instance_id
     from product_instances pi, product_instance_location_associations pila
     where pi.product_instance_id = pila.product_instance_id
     and pi.active = true
     and pila.active_location = true
     and pila.default_sale_location = true")
  PLUDF <- dbGetQuery(con,
    "select pppia.*,
     pi.unit_price, pi.is_club_list_selection,
     pi.is_clearance, pi.bottle_size_id
     from pos_plu_product_instance_associations pppia,
     product_instances pi
     where pi.product_instance_id = pppia.product_instance_id")

  catDF <- read.dbf(paste(dataDir, "/CAT.DBF",    sep = "")) %>% select(ID, NAME)
  itmDF <- read.dbf(paste(dataDir, "/ITM.DBF",    sep = "")) %>% select(ID, LONGNAME)
  empDF <- read.dbf(paste(dataDir, "/EMP.DBF",    sep = "")) %>% select(ID, FIRSTNAME, LASTNAME)

  gnditemDF <- read.dbf(paste(dataDir, "/GNDITEM.dbf", sep = "")) %>%
    select(EMPLOYEE, CHECK, HOUR, MINUTE, ITEM, QUANTITY, MODCODE, PRICE, SYSDATE, CATEGORY, TABLEID) %>%
    filter(!is.na(ITEM))

  salesDataDF <- merge(gnditemDF, empDF, by.x = "EMPLOYEE", by.y = "ID")
  salesDataDF <- merge(salesDataDF, catDF, by.x = "CATEGORY", by.y = "ID")
  salesDataDF <- merge(salesDataDF, itmDF, by.x = "ITEM", by.y = "ID") %>%
    filter(NAME %in% c("WINE", "BOTTLE WINE", "GLASS WINE")) %>%
    mutate(
      FIRSTNAME = as.character(FIRSTNAME),
      LASTNAME  = as.character(LASTNAME),
      LONGNAME  = as.character(LONGNAME),
      NAME      = as.character(NAME)
    )

  salesDataDF <- data.frame(salesDataDF)
  salesDataDF <- merge(salesDataDF, PLUDF,             by.x = "ITEM",               by.y = "pos_plu")
  salesDataDF <- merge(salesDataDF, productLocationDF, by.x = "product_instance_id", by.y = "product_instance_id")
  salesDataDF <- merge(salesDataDF, bottleSizeDF,      by.x = "bottle_size_id",      by.y = "bottle_size_id")

  salesDataDF <- salesDataDF %>%
    mutate(
      is_clearance           = replace_na(is_clearance, FALSE),
      is_club_list_selection = replace_na(is_club_list_selection, FALSE),
      major                  = majorId,
      minor                  = minorId,
      menu_price             = PRICE,
      sales_amt              = PRICE,
      is_option              = FALSE,
      disc_num               = 0,
      tax_code               = 1,
      deletion               = 0,
      overring               = FALSE,
      shift                  = NA
    ) %>%
    arrange(CHECK, HOUR, MINUTE) %>%
    rename(
      date_of_sale              = SYSDATE,
      check_num                 = CHECK,
      sales_cat                 = CATEGORY,
      num_sold                  = QUANTITY,
      user_name_first           = FIRSTNAME,
      user_name_last            = LASTNAME,
      pos_product_name          = LONGNAME,
      sales_units_sold          = number_sales_units,
      unit_cost_at_time_of_sale = unit_price,
      is_club_list_sale         = is_club_list_selection,
      is_clearance_sale         = is_clearance,
      sales_volume_unit_id      = sales_unit_id,
      sale_hour                 = HOUR,
      sale_minute               = MINUTE,
      table_number              = TABLEID,
      user_num                  = EMPLOYEE,
      item_num                  = ITEM
    ) %>%
    mutate(time_of_sale = as.integer(paste(sale_hour, sale_minute, sep = ""))) %>%
    select(-c(PRICE, bottle_size_id, MODCODE, NAME,
              is_wine_list_bin_number, bottle_size, bottle_size_unit))

  # FIXED: removed view() calls (crash in scheduled/batch context)
  if (test) {
    dbExecute(con, "delete from pos_chkitems where date_of_sale = '1999-12-31'")
    salesDataDF <- salesDataDF %>% mutate(date_of_sale = "1999-12-31")
    dbWriteTable(con, "pos_chkitems", salesDataDF,
      row.names = FALSE, overwrite = FALSE, append = TRUE,
      field.types = NULL, temporary = FALSE, copy = TRUE)
  } else {
    dbWithTransaction(con, {
      dbWriteTable(con, "pos_chkitems", salesDataDF,
        row.names = FALSE, overwrite = FALSE, append = TRUE,
        field.types = NULL, temporary = FALSE, copy = TRUE)
    })
  }
}

getAlohaDataSourceId <- function(con) {
  df <- dbGetQuery(con,
    "select data_import_source_id from data_import_sources where lower(data_import_source_name) = 'aloha'")
  df[[1]]
}

# FIXED: simplified with early returns instead of nested if/isValid pattern
folderIsValid <- function(folder) {
  ini  <- paste(folder, "/Aloha.ini",   sep = "")
  line <- paste(folder, "/GNDLINE.dbf", sep = "")

  if (!file.exists(ini) || !file.exists(line) || file.size(line) <= 1000) {
    return(FALSE)
  }

  iniDF <- read.csv2(ini, sep = "=", skip = 1, header = FALSE)
  rNum  <- as.integer(iniDF[iniDF$V1 == "UNITNUMBER", ]["V2"])
  !is.na(rNum)
}
