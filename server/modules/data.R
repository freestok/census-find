data_post <- function(con, config, req) {
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

  
  return ('yo')
}