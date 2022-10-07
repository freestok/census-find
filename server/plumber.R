library(plumber)
library(here)
library(assertthat)
library(sf)
library(geojsonsf)
library(dbplyr)
library(glue)

# custom function imports
source(here('modules', '__helper.R'))
source(here('modules', 'variables.R'))
source(here('modules', 'geom.R'))
source(here('modules', 'data.R'))

con <- get_con()
config <- jsonlite::read_json(here('modules','config','config.json'))

#* @apiTitle census-find api
#* @apiDescription Helps power the front-end of census-find. Mainly returns data from the database

#* Return variables for a given dataset, year, and whether you want all of them or not
#* @param type dataset the user wants 
#* @param year year of dataset
#* @param shallow can be true or false
#* @get /variables
function(type, year, shallow) {
  variables_get(con, year, type, shallow)
}

#* Only meant to display geometries for the front-end map
#* @param type type of variables (ACS, DEC)
#* @get /geom
function(type, state=NULL) {
  geom_get(con, type, state)
}

#* Only meant to display geometries for the front-end map
#* @post /data
function(req) {
  data_post(con, req)
}

