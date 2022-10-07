geom_get <- function(con, type, state) {
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
  if (!(all(type_assert, state_assert))) {
    stop('Invalid parameters')
  } 

  query <- glue("select name, geoid, geometry from {type}_simple")
  if (type != "states") {
    query = glue("{query} WHERE stusps = '{state}'")
  }
  sf::st_read(con, query = query) |>
    geojsonsf::sf_geojson(digits=5)
}
