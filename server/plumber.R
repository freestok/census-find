library(plumber)
library(here)
library(assertthat)
library(sf)
library(geojsonsf)
library(dbplyr)

# custom function imports
source(here('modules', 'helper.R'))
source(here('modules', 'variables.R'))
source(here('modules', 'geom.R'))

con <- get_con()
print('Got con!')
#* @apiTitle census-find api
#* @apiDescription Helps power the front-end of census-find. Mainly returns data from the database

#* Return variables for a given dataset, year, and whether you want all of them or not
#* @param type dataset the user wants 
#* @param year year of dataset
#* @param shallow can be true or false
#* @get /variables
function(type, year, shallow) {
  # make sure all parameters are acceptable
  type_assert <- assert_help(type, c('acs5', 'pl', 'sf1'))
  year_assert <- assert_help(year, c('2010', '2020'))
  shallow_assert <- assert_help(shallow, c('TRUE','FALSE'))
  valid <- all(c(type_assert, year_assert, shallow_assert))
  if (valid) {
    print(glue('Returning dataset {type}_{year}_vars'))
    return (variables_get(con, year, type, shallow))
  } else {
    stop()
    return ()
  }
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
  body <- req$body
  body_args <- names(body)

  # TODO determine the data structure, b/c maybe it should be something like:
  # {
  #   "acs5": {
  #     "year": 2020,
  #     "vars": []
  #   },
  #   "sf1": {
  #     "year": 2010,
  #     "vars": []
  #   }
  # }
  # get the arguments
  dataset <- body$dataset
  year <- body$year
  geoid <- body$geoid
  geom <- body$geom

  # assert the proper arguments are passed in
  dataset_assert <- assert_help(body$dataset, c('acs5', 'pl', 'sf1'))
  year_assert <- assert_help(body$year, c('2010', '2020'))
  geom_assert <- assert_help(geom, c('states', 'tracts', 'counties', 'places'))

  # TODO assert variables are valid
  query <- glue('SELECT name FROM {dataset}_{year}_vars;')
  all_names <- dbGetQuery(con, query)

  # then assert the values of those arguments are valid
  if (!(all(geom_assert, year_assert, dataset_assert))) {
    stop('Invalid Parameters')
  }
  
  return ('yo')
}

