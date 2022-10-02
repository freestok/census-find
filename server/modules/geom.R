library(dbplyr)
library(stringr)
library(glue)

geom_get <- function(con, type, state) {
  table <- glue('{dataset}_{year}_vars')
  query = glue('SELECT name, label, concept FROM {table}')
  if (shallow == 'TRUE') {
    query = glue('{query} WHERE tab = 0')
  }
  
  
  dbGetQuery(con, query)
}