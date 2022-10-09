data_post <- function(env, req) {
  con = env$con
  config = env$config
  body <- req$body
  # body_args <- names(body)
  
  # get the arguments
  print('time to loop')
  # print(body)
  # jsTxt <- jsonlite::toJSON(body$data)
  # body_data <- jsonlite::fromJSON(jsTxt)
  body_data <- split(body$data, 1:nrow(body$data))
  print(body_data)
  print('****************')
  to_return = c()
  for (item in body_data) {
    print(item)
    # some of these are possible values
    dataset   <- item$dataset
    print('got dataset')
    geoid      <- item$geoid
    print(geoid)
    print('got name')
    geography <- item$geography
    print('got geography')
    table     <- item$table
    print('got table')
    variables <- item$variables
    print('got variables')
    state     <- item$state
    print('got state')
    county    <- item$county
    print('got county')
    year      <- item$year
    print('got year')
    
    # get acs or decennial (only these for now)
    # geography can be tract, county, state, or place (for now)
    if (dataset == 'acs') {
      data <- get_acs(
        geography = geography,
        survey = table,
        variables = variables[[1]],
        state = state,
        county = county,
        year = year,
      ) |>
        filter(GEOID == geoid) |>
        mutate(var_group = str_extract(variable, '^[^_]+(?=_)')) |>
        group_by(var_group) |>
        mutate(group_max = max(estimate)) |>
        ungroup() |>
        mutate(
          percent = 100 * (estimate / group_max),
          moe_perc = 100 * (moe / estimate)
        ) |>
        select(-NAME,-group_max,-var_group)
      
    } else if (dataset == 'decennial') {
      data <- get_decennial(
        geography = geography,
        survey = table,
        variables = variables[[1]],
        state = state,
        county = county,
        year = year,
      ) |>
        filter(GEOID == geoid) |>
        mutate(var_group = str_replace(variable, '(\\d{3})$', '')) |>
        group_by(var_group) |>
        mutate(group_max = max(value)) |>
        ungroup() |>
        mutate(percent = 100 * (value / group_max),) |>
        select(-NAME,-group_max,-var_group)
      
    }
    to_return = append(to_return, data)

  }
  print(head(data))
  
  return (to_return)
}


# {
#     "data": [
#         {
#             "dataset": "acs",
#             "table": "acs5",
#             "year": 2020,
#             "geography": "tract",
#             "geoid": "26081000200",
#             "state": "MI",
#             "county": "Kent",
#             "variables": [
#                 "B01001_001",
#                 "B01003_001",
#                 "B02001_001"
#             ]
#         }
#     ]
# }