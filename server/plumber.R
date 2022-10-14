library(assertthat)
library(dbplyr)
library(geojsonsf)
library(glue)
library(here)
library(plumber)
library(sf)
library(tidycensus)
library(tidyverse)

# custom function imports
source(here('modules', '__helper.R'))
source(here('modules', 'data.R'))
source(here('modules', 'geom.R'))
source(here('modules', 'variables.R'))
source(here('modules', 'templates.R'))

print(pr)
# con <- get_con()
config <- jsonlite::read_json(here('modules','config','config.json'))
env <- list(con = con, config = config)

# register census key
census_key = helper_get_census_key()
census_api_key(census_key)

# -------------------------- FILTERS ------------------------------------------
#* @filter cors
cors <- function(res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    plumber::forward()
}

# -------------------------- END POINTS----------------------------------------

#* @apiTitle census-find api
#* @apiDescription Helps power the front-end of census-find. Mainly returns data from the database

#* Return variables for a given dataset, year, and whether you want all of them or not
#* @param type dataset the user wants 
#* @param year year of dataset
#* @param shallow can be true or false
#* @get /variables
function(type, year, shallow) {
  variables_get(env, year, type, shallow)
}

#* Only meant to display geometries for the front-end map
#* @param type type of variables (ACS, DEC)
#* @get /geom
function(type, state=NULL) {
  geom_get(env, type, state)
}

#* Get all geometry names for searching purposes
#* @get /geom/names/<type>
function(type) {
  geom_get_names(env, type)
}

#* Only meant to display geometries for the front-end map
#* @post /data/acs
function(req) {
  data_acs_post(req)
}

#* Only meant to display geometries for the front-end map
#* @post /data/dec
function(req) {
  data_dec_post(req)
}

#* For returning templates to the user
#* @param id ID of the template to be retrieved
#* @get /templates/<id:int>
function(id) {
  templates_vars_get(con, id)
}

#* Return 
#* @param category Return all or a certain subset of categories
#* @get /templates/<category>
function(category) {
  templates_get(con, category)
}

#* For creating templates
#* @post /templates
function(req) {
}

#* For updating templates
#* @put /templates
function(req) {
}