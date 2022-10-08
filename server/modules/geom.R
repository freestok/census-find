geom_get <- function(env, type, state) {
  con = env$con
  config = env$config

  helper_valid('^[a-zA-Z]+$', type)

  query <- glue("select name, geoid, geometry from {type}_simple")
  if (type != "states") {
    helper_valid('^[a-zA-Z]{2}$', state)
    query = glue("{query} WHERE stusps = '{state}'")
  }
  sf::st_read(con, query = query) |>
    geojsonsf::sf_geojson(digits=5)
}