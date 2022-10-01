library(plumber)
library(here)
source("helper.R")
source(here('server','modules', 'variables.R'))

con <- get_con()
print('Got con!')
#* @apiTitle Plumber Example API
#* @apiDescription Plumber example description.

#* Return variables for a given dataset, year, and whether you want all of them or not
#* @param type type of variables (ACS, DEC)
#* @param year year of dataset
#* @param shallow can be true or false
#* @get /variables
function(type, year, shallow) {
  type_assert <- assert_help(type, c('acs5', 'pl', 'sf1'))
  year_assert <- assert_help(year, c('2010', '2020'))
  shallow_assert <- assert_help(shallow, c('TRUE','FALSE'))
  valid <- all(c(type_assert, year_assert, shallow_assert))
  if (valid) {
    return (get_variables(con, year, type, shallow))
  } else {
    stop()
    return ()
  }
}

