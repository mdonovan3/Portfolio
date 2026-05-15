library(here)
library(DBI)
library(RPostgres)
library(tidyverse)
library(readxl)
library(openxlsx)
library(janitor)

getShifts <- function(con) {
  dbGetQuery(con, "select * from shifts where active = true")
}

getRestaurants <- function(con) {
  dbGetQuery(con, "select * from entities where active = true")
}

getDataImportSourceID <- function(con) {
  dbGetQuery(con, "select data_import_source_id from data_import_sources where lower(data_import_source_name) = 'tip sheets'")[1, 1]
}

getDBConnection <- function() {
  con <- dbConnect(RPostgres::Postgres(),
    dbname = Sys.getenv("db_name"),
    host   = Sys.getenv("db_host"),
    port   = Sys.getenv("db_port"),
    user   = Sys.getenv("db_user"),
    password = Sys.getenv("db_pass")
  )
  con
}

# Idempotent insert — skips if any date in the tip sheet is already in the DB.
insertTipSheet <- function(DF, entityNumber, con) {
  minDate   <- min(DF$tip_date, na.rm = TRUE)
  maxDate   <- max(DF$tip_date, na.rm = TRUE)
  dateRange <- DF %>%
    mutate(tip_date = as.character(tip_date)) %>%
    select(tip_date) %>%
    distinct() %>%
    unlist(use.names = FALSE)

  dataSourceID     <- getDataImportSourceID(con)
  insertQuery      <- paste0("insert into data_imports (entity_id, import_source_id, is_date_range, import_start_date_range, import_end_date_range) values (",
                             entityNumber, ", ", dataSourceID, ", TRUE, '", minDate, "', '", maxDate, "')")
  maxImportIdQuery <- paste0("select coalesce(max(data_import_id), 0) from data_imports where entity_id = ", entityNumber, " and import_source_id = ", dataSourceID)

  datesString <- paste(shQuote(dateRange, type = "sh"), collapse = ", ")
  alreadyExists <- as.integer(dbGetQuery(con,
    paste0("select count(*) from employee_tips where entity_id = ", entityNumber, " and tip_date in (", datesString, ")")
  )[1, 1]) > 0

  if (alreadyExists) {
    message("Tip sheet dates already imported — skipping.")
    return(FALSE)
  }

  dbWithTransaction(con, {
    currentImportId <- as.integer(dbGetQuery(con, maxImportIdQuery)[1, 1])
    dbExecute(con, insertQuery)
    currentImportId <- as.integer(dbGetQuery(con, maxImportIdQuery)[1, 1])
    DF <- DF %>%
      mutate(data_import_id = currentImportId) %>%
      mutate(entity_id = entityNumber)
    dbWriteTable(con, "employee_tips", DF,
      row.names = FALSE, overwrite = FALSE, append = TRUE,
      field.types = NULL, temporary = FALSE, copy = TRUE
    )
  })
  TRUE
}

# Parse a BRG weekly tip sheet (Excel "Summary" sheet).
# Columns are date-pairs (Lunch/Dinner) with Excel serial dates in the header row.
getDFFromBRGTipSheet <- function(f, BRGEntityId, shifts) {
  getShiftId <- Vectorize(function(name) {
    as.integer(shifts %>% filter(tolower(shift_name) == tolower(name)) %>% select(shift_id))
  })

  char_date <- function(x) as.character(openxlsx::convertToDate(as.numeric(x)))

  headers <- readxl::read_excel(f, sheet = "Summary", n_max = 2, col_names = FALSE)
  headers[2, 12] <- "Lunch"
  headers <- headers %>% select(-`...1`)

  cnames <- c("payroll_id", "employee_name")
  for (i in c(2, 4, 6, 8, 10, 12, 14)) {
    cnames <- append(cnames, c(paste(char_date(headers[1, i]), "Lunch"),
                               paste(char_date(headers[1, i]), "Dinner")))
  }

  brg_tips <- readxl::read_excel(f, sheet = "Summary", skip = 2) %>%
    select(-c(3))
  colnames(brg_tips) <- cnames

  brg_tips %>%
    filter(!is.na(payroll_id) & !is.na(employee_name)) %>%
    mutate_at(3:16, as.numeric) %>%
    mutate_at(3:16, ~ replace_na(., 0)) %>%
    pivot_longer(cols = 3:16, names_to = "shift", values_to = "tip_amount") %>%
    filter(tip_amount != 0) %>%
    separate(shift, into = c("date", "shift"), sep = " ") %>%
    mutate(tip_amount = round(tip_amount, 2)) %>%
    mutate(tip_date  = as.Date(date, "%Y-%m-%d")) %>%
    mutate(entity_id = BRGEntityId) %>%
    mutate(shift_id  = getShiftId(shift)) %>%
    rename(employee_r365_payroll_id = payroll_id) %>%
    select(-c(date, shift)) %>%
    arrange(tip_date, desc(shift_id), employee_r365_payroll_id)
}

# Parse a Bones weekly tip sheet (Excel "Server Detail Page" sheet).
# Bones header structure differs from BRG — end date is passed in and the
# 7-day sequence is derived by counting backwards.
getDFFromBonesTipSheet <- function(file, BNSEntityId, shifts, endDate) {
  getShiftId <- Vectorize(function(name) {
    as.integer(shifts %>% filter(tolower(shift_name) == tolower(name)) %>% select(shift_id))
  })

  seq <- rev(seq(endDate, length = 7, by = "-1 day"))

  cnames <- c("employee_r365_payroll_id", "employee_name")
  for (d in seq[1:5]) {
    cnames <- append(cnames, c(paste(d, "Lunch"), paste(d, "Dinner")))
  }
  cnames <- append(cnames, paste(seq[[6]], "Dinner"))
  cnames <- append(cnames, paste(seq[[7]], "Dinner"))

  bns_tips <- readxl::read_excel(file, sheet = "Server Detail Page", skip = 3, .name_repair = "unique_quiet") %>%
    select(1:14)
  colnames(bns_tips) <- cnames

  bns_tips %>%
    filter(!is.na(`employee_r365_payroll_id`)) %>%
    janitor::remove_empty(which = "cols") %>%
    mutate_at(3:ncol(.), as.numeric) %>%
    mutate_at(3:ncol(.), ~ replace_na(., 0)) %>%
    pivot_longer(cols = 3:ncol(.), names_to = "shift", values_to = "tip_amount") %>%
    filter(tip_amount != 0) %>%
    separate(shift, into = c("tip_date", "shift"), sep = " ") %>%
    mutate(employee_r365_payroll_id = as.integer(employee_r365_payroll_id)) %>%
    mutate(tip_date  = as.Date(tip_date, "%Y-%m-%d")) %>%
    mutate(shift_id  = as.numeric(getShiftId(shift))) %>%
    mutate(entity_id = BNSEntityId) %>%
    select(-shift) %>%
    arrange(tip_date, desc(shift_id), employee_r365_payroll_id)
}
