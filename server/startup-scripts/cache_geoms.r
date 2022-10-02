library(tidyverse)
library(tigris)
library(sf)

cache_geoms <- function(con) {
  # get states dataset, only get the 50, not territories
  all_states <-
    c( 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 
       'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 
       'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 
       'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
       'WV', 'WI', 'WY' )
  print('cache states')
  states(year = 2020, cb = TRUE) |>
    filter(STUSPS %in% all_states) |>
    select(GEOID, NAME, STUSPS) |>
    rename_all(.funs = tolower) |>
    st_transform(4326) |>
    st_write(con, 'states', layer_options = "OVERWRITE=true")
  
  # get counties
  print('cache counties')
  counties(cb = TRUE, year = 2020) |>
    filter(STUSPS %in% all_states) |>
    select(GEOID, NAME, STATE_NAME, STUSPS) |>
    rename_all(.funs = tolower) |>
    st_transform(4326) |>
    st_write(con, 'counties', layer_options = "OVERWRITE=true")
  
  # get tracts
  print('cache tracts')
  tracts_list <- vector('list', length = length(all_states))
  for (i in seq_along(all_states)) {
    tract_df <- tracts(cb = TRUE,
                       year = 2020,
                       state = all_states[[i]]) |>
      select(GEOID, NAME, STUSPS) |>
      rename_all(.funs = tolower) |>
      st_transform(4326)
    
    tracts_list[[i]] <- tract_df
  }
  bind_rows(tracts_list) |>
    st_write(con, 'tracts', layer_options = "OVERWRITE=true")
  
  # get places
  print('cache places')
  places(cb = TRUE, year = 2020) |>
    filter(STUSPS %in% all_states) |>
    select(GEOID, NAME, STATE_NAME, STUSPS) |>
    rename_all(.funs = tolower) |>
    st_transform(4326) |>
    st_write(con, 'places', layer_options = "OVERWRITE=true")
  
}
