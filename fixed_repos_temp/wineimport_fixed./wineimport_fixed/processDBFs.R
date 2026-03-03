if (!require("pacman")) install.packages("pacman")
pacman::p_load(tidyverse, foreign, RCurl, zip, here, DBI, RPostgreSQL, gtools, RPostgres)

test <- FALSE

baseDir    <- case_when(Sys.info()[["sysname"]] == "Windows" ~ "c:/scripts/WineSalesImport", .default = here())
AlohaPath  <- case_when(Sys.info()[["sysname"]] == "Windows" ~ "c:/BootDrv/Aloha",          .default = paste(here(), "/data", sep = ""))

# Load credentials from .Renviron (db_host, db_port, db_user, db_pass)
readRenviron(paste(baseDir, "/.Renviron", sep = ""))
source(paste(baseDir, "/functions.R", sep = ""), echo = FALSE)

LHRCCon      <- getDBConnection("lhrc_data")
entitiesDF   <- dbGetQuery(LHRCCon, "select * from entities")
dataSourceID <- getAlohaDataSourceId(LHRCCon)

wineDBCon <- NULL

numFolderToProcess <- 14

# Get most recent N date-named folders under AlohaPath
folders <- list.dirs(AlohaPath, recursive = FALSE)
folders <- folders[grepl("/\\d{8}$", folders)]
temp    <- as.Date(sub("^\\S+([0-9]{8})", "\\1", folders), "%Y%m%d")
folders <- folders[order(temp, decreasing = TRUE)]
folders <- folders[1:numFolderToProcess]

for (folder in folders) {
  if (folderIsValid(folder)) {
    bname      <- basename(folder)
    folderDate <- as.Date(bname, format = "%Y%m%d")

    ini   <- read.csv2(paste(folder, "/Aloha.ini", sep = ""), sep = "=", skip = 1, header = FALSE)
    rNum  <- as.integer(ini[ini$V1 == "UNITNUMBER", ]["V2"])

    entityRow     <- entitiesDF %>% filter(aloha_id == rNum)
    entityNumber  <- as.integer(unlist(entityRow %>% select(entity_id)))
    wineDBName    <- as.character(unlist(entityRow %>% select(wine_db_name)))
    majorId       <- as.integer(unlist(entityRow %>% select(wine_major_category_id)))
    minorId       <- as.integer(unlist(entityRow %>% select(wine_minor_category_id)))

    message("Processing folder: ", bname, " | entity: ", entityNumber, " | db: ", wineDBName)

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
