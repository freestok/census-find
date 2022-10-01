library(RPostgres)
library(dbplyr)


get_con <- function() {
  readRenviron('.Renviron')
  db <- Sys.getenv("postgres_db")
  port <- Sys.getenv("postgres_port")
  user <- Sys.getenv("postgres_user")
  pw <- Sys.getenv("postgres_pw")
  print(db)
  print(port)
  print(user)
  print(pw)
  DBI::dbConnect(
    RPostgres::Postgres(),
    dbname = db,
    port = port,
    user = user,
    password = pw
  )
}

stuff <- function(con) {
  dbGetQuery(con, 'SELECT * FROM acs5_2020_vars limit 5;')
}
