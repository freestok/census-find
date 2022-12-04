library(RPostgres)
library(dbplyr)
library(pool)

get_con <- function() {
  readRenviron('.Renviron')
  db <- Sys.getenv("postgres_db")
  port <- Sys.getenv("postgres_port")
  user <- Sys.getenv("postgres_user")
  pw <- Sys.getenv("postgres_pw")
  host <- Sys.getenv("host")
  dbPool(
    RPostgres::Postgres(),
    dbname = db,
    port = port,
    user = user,
    password = pw,
    host = host
  )
}

helper_get_census_key <- function() {
  readRenviron('.Renviron')
  Sys.getenv('census_key')
}

assert_help <- function(x, vals) {
  assertthat::are_equal(x %in% vals, TRUE)
}

helper_valid <- function(regex, value) {
  valid <- grepl(regex, value)
  if (!valid) {
    stop('Invalid parameters')
  }
}
