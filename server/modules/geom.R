library(dbplyr)
library(stringr)
library(glue)
library(sf)

geom_get <- function(con, type, state) {
  # query = glue('SELECT jsonb_build_object FROM {type}_geojson')
  # if (type != 'states') {
  #   query = glue("{query} WHERE stusps = '{state}'")
  # } 
  
  # # return the results
  # res <- dbGetQuery(con, query)
  # jsonlite::fromJSON(res[[1]])
  query <- glue("select name, geoid, geometry from {type}_simple")
  if (type != "states") {
    query = glue("{query} WHERE stusps = '{state}'")
  }
  x = st_read(con, query = query)
  geojsonsf::sf_geojson(x, digits=5)
}