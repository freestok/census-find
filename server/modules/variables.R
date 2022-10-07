variables_get <- function(con, year, dataset, shallow) {
  # make sure all parameters are acceptable
  type_assert <- assert_help(type, c('acs5', 'pl', 'sf1'))
  year_assert <- assert_help(year, c('2010', '2020'))
  shallow_assert <- assert_help(shallow, c('TRUE','FALSE'))
  valid <- all(c(type_assert, year_assert, shallow_assert))
  if (!valid) {
    stop('Invalid parameters')
  }
  table <- glue('{dataset}_{year}_vars')
  query = glue('SELECT name, label, concept FROM {table}')
  if (shallow == 'TRUE') {
    query = glue('{query} WHERE tab = 0')
  }
  
  dbGetQuery(con, query)
}