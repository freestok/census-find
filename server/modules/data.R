data_post <- function(con, req) {
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