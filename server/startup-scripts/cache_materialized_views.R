library(glue)
library(tidyverse)
library(dbplyr)

cache_views <- function(tbl, cols, con) {
  # first drop materialized view if it already exists
  drop_materialized <- 'DROP MATERIALIZED VIEW places_geojson;'
  tryCatch(
    expr = {
      query <- glue('DROP MATERIALIZED VIEW {tbl}_geojson;')
      dbExecute(con, query)
    },
    error = function(e) {
      print(e)
      print('materialized view does not exist')
    }
  )
  
  # create materialized views
  cols_str <- paste(cols, collapse = ',')
  print(cols_str)
  query <- glue(
    "CREATE MATERIALIZED VIEW {tbl}_geojson AS
      SELECT stusps,
        Json_build_object(
          'type',
          'FeatureCollection',
          'features',
          Json_agg(
            St_asgeojson(t.*):: json
          )
        )
      FROM (
        SELECT {cols_str}, geometry
        FROM {tbl}
      ) AS t
  GROUP BY
    stusps WITH data;"
  )
  print(query)
  dbExecute(con, query)
}
