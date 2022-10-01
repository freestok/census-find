library(dbplyr)
library(stringr)
library(glue)

get_variables <- function(con, year, dataset, shallow) {
  table <- str_c(dataset, year, 'vars', sep='_')
  query = glue('SELECT name, label, concept FROM {table}')
  if (shallow == 'TRUE') {
    query = glue('{query} WHERE tab = 0')
  }
  
  dbGetQuery(con, query)
}