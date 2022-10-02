library(plumber)
library(here)
source("helper.R")
source(here('server','modules', 'variables.R'))

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
  all_states <- c('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 
                  'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 
                  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 
                  'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 
                  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 
                  'WY')
  acceptable_type <- c('counties', 'places', 'states', 'tracts', 'nation')
  type_assert <- assert_help(type, acceptable_type)
  
  # if a state argument was passed, make sure it's in the list of all_states
  # if there is nothing passed, then the assertion is true by default
  state_assert <- TRUE
  if (is.string(state)) {
    state_assert <- assert_help(state, all_states)
  }
  
  # if everything is tip-top, then return the geoms
  if (all(type_assert, state_assert)) {
    return(geom_get(type, state))
  } else {
    stop()
    return()
  }
}

