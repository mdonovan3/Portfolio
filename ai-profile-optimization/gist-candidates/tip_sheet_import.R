library(DBI)
library(RPostgres)
library(readxl)
library(openxlsx)
library(tidyverse)
library(janitor)

# Parses weekly payroll tip-sheet Excel files (two different layouts — one per
# restaurant) into a normalized long-form dataframe keyed by employee + date +
# shift, then inserts into PostgreSQL with a duplicate-date guard.
#
# Challenge: the Excel files use numeric date serials as column headers (not
# strings), and the two restaurants use different sheet layouts requiring
# separate parsers. Both pivot from wide (one column per day/shift) to long.
#
# Credentials loaded from .Renviron: DB_HOST, DB_PORT, DB_USER, DB_PASS

getDBConnection <- function() {
  dbConnect(
    RPostgres::Postgres(),
    dbname   = "lhrc_data",
    host     = Sys.getenv("DB_HOST"),
    port     = Sys.getenv("DB_PORT"),
    user     = Sys.getenv("DB_USER"),
    password = Sys.getenv("DB_PASS")
  )
}

getShifts <- function(con) {
  dbGetQuery(con, "select * from shifts where active = true")
}

getRestaurants <- function(con) {
  dbGetQuery(con, "select * from entities where active = true")
}

getDataImportSourceID <- function(con) {
  dbGetQuery(con,
    "select data_import_source_id from data_import_sources
     where lower(data_import_source_name) = 'tip sheets'"
  )[1, 1]
}

isInExistingDateRange <- function(dates, entity, con) {
  datesString <- paste(shQuote(dates, type = "sh"), collapse = ", ")
  res <- dbGetQuery(con,
    paste0("select count(*) from employee_tips ",
           "where entity_id = ", entity,
           " and tip_date in (", datesString, ")")
  )[1, 1]
  as.integer(res) > 0
}

insertTipSheet <- function(DF, entityNumber, con) {
  minDate   <- min(DF$tip_date, na.rm = TRUE)
  maxDate   <- max(DF$tip_date, na.rm = TRUE)
  dateRange <- DF %>%
    mutate(tip_date = as.character(tip_date)) %>%
    select(tip_date) %>%
    distinct() %>%
    unlist(use.names = FALSE)

  if (isInExistingDateRange(dateRange, entityNumber, con)) {
    message("Tip sheet already imported for this date range — skipping.")
    return(FALSE)
  }

  dataSourceID    <- getDataImportSourceID(con)
  maxImportIdQuery <- paste0(
    "select coalesce(max(data_import_id), 0) from data_imports ",
    "where entity_id = ", entityNumber, " and import_source_id = ", dataSourceID)
  insertQuery <- paste0(
    "insert into data_imports ",
    "(entity_id, import_source_id, is_date_range, import_start_date_range, import_end_date_range) values ",
    "(", entityNumber, ", ", dataSourceID, ", TRUE, '", minDate, "', '", maxDate, "')")

  dbWithTransaction(con, {
    currentImportId <- as.integer(dbGetQuery(con, maxImportIdQuery)[1, 1]) + 1
    dbExecute(con, insertQuery)
    DF <- DF %>%
      mutate(data_import_id = currentImportId, entity_id = entityNumber)
    dbWriteTable(con, "employee_tips", DF,
      row.names = FALSE, overwrite = FALSE, append = TRUE,
      field.types = NULL, temporary = FALSE, copy = TRUE)
  })

  TRUE
}

# --- Parser: Restaurant 1 tip sheet -----------------------------------------
# Layout: "Summary" sheet. Row 1 = date serials (numeric), row 2 = shift names.
# Column 3 is a duplicate subtotal — dropped. Dates converted via openxlsx.

getDFFromBRGTipSheet <- function(f, entityId, shifts) {
  getShiftId <- Vectorize(function(name) {
    as.integer(shifts %>% filter(tolower(shift_name) == tolower(name)) %>% pull(shift_id))
  })

  char_date <- function(x) as.character(openxlsx::convertToDate(as.numeric(x)))

  headers <- readxl::read_excel(f, sheet = "Summary", n_max = 2, col_names = FALSE) %>%
    select(-`...1`)
  headers[2, 12] <- "Lunch"   # correct a mislabeled header in this sheet layout

  # Build "YYYY-MM-DD Shift" column names from numeric date serials in row 1
  date_cols <- as.character(headers[1, seq(2, 14, by = 2)])
  cnames <- c("payroll_id", "employee_name",
               unlist(lapply(date_cols, function(d) c(paste(char_date(d), "Lunch"),
                                                       paste(char_date(d), "Dinner")))))

  tips <- readxl::read_excel(f, sheet = "Summary", skip = 2) %>%
    select(-3) %>%
    setNames(cnames) %>%
    filter(!is.na(payroll_id) & !is.na(employee_name)) %>%
    mutate_at(3:16, as.numeric) %>%
    mutate_at(3:16, ~ replace_na(., 0)) %>%
    pivot_longer(cols = 3:16, names_to = "shift", values_to = "tip_amount") %>%
    filter(tip_amount != 0) %>%
    separate(shift, into = c("date", "shift"), sep = " ") %>%
    mutate(
      tip_amount                  = round(tip_amount, 2),
      tip_date                    = as.Date(date, "%Y-%m-%d"),
      entity_id                   = entityId,
      shift_id                    = getShiftId(shift),
      employee_r365_payroll_id    = payroll_id
    ) %>%
    select(-c(date, shift, payroll_id)) %>%
    arrange(tip_date, desc(shift_id), employee_r365_payroll_id)

  tips
}

# --- Parser: Restaurant 2 tip sheet -----------------------------------------
# Layout: "Server Detail Page" sheet. Dates are NOT in the file — they are
# inferred from the week-end date passed in as endDate (supplied externally,
# e.g. parsed from the filename). Sparse columns removed via janitor.

getDFFromBonesTipSheet <- function(file, entityId, shifts, endDate) {
  getShiftId <- Vectorize(function(name) {
    as.integer(shifts %>% filter(tolower(shift_name) == tolower(name)) %>% pull(shift_id))
  })

  # Reconstruct the 7-day sequence ending on endDate
  week_seq <- rev(seq(endDate, length = 7, by = "-1 day"))

  cnames <- c("employee_r365_payroll_id", "employee_name",
               unlist(lapply(week_seq, function(d) c(paste(d, "Lunch"), paste(d, "Dinner")))))
  # Note: seq[[6]] has no Lunch column in this layout (Bones closes for lunch Sat/Sun)
  cnames[length(cnames) - 1] <- paste(week_seq[[6]], "Dinner")

  tips <- readxl::read_excel(file, sheet = "Server Detail Page",
                               skip = 3, .name_repair = "unique_quiet") %>%
    select(1:14) %>%
    setNames(cnames) %>%
    filter(!is.na(employee_r365_payroll_id)) %>%
    janitor::remove_empty("cols") %>%
    mutate_at(3:ncol(.), as.numeric) %>%
    mutate_at(3:ncol(.), ~ replace_na(., 0)) %>%
    pivot_longer(cols = 3:ncol(.), names_to = "shift", values_to = "tip_amount") %>%
    filter(tip_amount != 0) %>%
    separate(shift, into = c("tip_date", "shift"), sep = " ") %>%
    mutate(
      employee_r365_payroll_id = as.integer(employee_r365_payroll_id),
      tip_date                 = as.Date(tip_date, "%Y-%m-%d"),
      shift_id                 = as.numeric(getShiftId(shift)),
      entity_id                = entityId
    ) %>%
    select(-shift) %>%
    arrange(tip_date, desc(shift_id), employee_r365_payroll_id)

  tips
}
