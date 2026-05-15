# Processes the N most recent Aloha daily export folders and imports wine sales
# into PostgreSQL. Cross-platform: detects Windows vs Linux for path resolution.
# Reads Aloha.ini from each folder to identify the restaurant (UNITNUMBER →
# entity_id), then routes to the correct database. Idempotent — skips dates
# already present in pos_chkitems.
#
# Requires: aloha_dbf_functions.R, .Renviron with db_host/port/user/pass

if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, foreign, RCurl, zip, here, DBI, RPostgreSQL, gtools, RPostgres)

source("aloha_dbf_functions.R")

test <- FALSE

# Cross-platform path resolution
baseDir   <- case_when(Sys.info()[["sysname"]] == "Windows" ~ "c:/scripts/WineSalesImport",
                       .default = here())
AlohaPath <- case_when(Sys.info()[["sysname"]] == "Windows" ~ "c:/BootDrv/Aloha",
                       .default = file.path(here(), "data"))

readRenviron(file.path(baseDir, ".Renviron"))

LHRCCon      <- getDBConnection("lhrc_data")
entitiesDF   <- dbGetQuery(LHRCCon, "select * from entities")
dataSourceID <- getAlohaDataSourceId(LHRCCon)

numFolderToProcess <- 14

# Get the most recent N date-named subdirectories (format: YYYYMMDD)
folders <- list.dirs(AlohaPath, recursive = FALSE)
folders <- folders[grepl("/\\d{8}$", folders)]
temp    <- as.Date(sub("^\\S+([0-9]{8})", "\\1", folders), "%Y%m%d")
folders <- folders[order(temp, decreasing = TRUE)][1:numFolderToProcess]

for (folder in folders) {
  if (folderIsValid(folder)) {
    bname      <- basename(folder)
    folderDate <- as.Date(bname, format = "%Y%m%d")

    # Read Aloha.ini to get the restaurant number and route to the right DB
    ini        <- read.csv2(file.path(folder, "Aloha.ini"), sep = "=", skip = 1, header = FALSE)
    rNum       <- as.integer(ini[ini$V1 == "UNITNUMBER", ]["V2"])

    entityRow    <- entitiesDF %>% filter(aloha_id == rNum)
    entityNumber <- as.integer(unlist(entityRow %>% select(entity_id)))
    wineDBName   <- as.character(unlist(entityRow %>% select(wine_db_name)))
    majorId      <- as.integer(unlist(entityRow %>% select(wine_major_category_id)))
    minorId      <- as.integer(unlist(entityRow %>% select(wine_minor_category_id)))

    message("Processing: ", bname, " | entity: ", entityNumber, " | db: ", wineDBName)

    wineDBCon <- getDBConnection(wineDBName)

    if (test || !importExistsInDB(folderDate, entityNumber, wineDBCon)) {
      importWineSales(folder, majorId, minorId, wineDBCon, test)
    } else {
      message("  Already imported, skipping.")
    }

    dbDisconnect(wineDBCon)
  }
}

dbDisconnect(LHRCCon)
