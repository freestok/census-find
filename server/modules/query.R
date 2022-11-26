query_acs_post <- function(req) {
  body <- req$body

  if (body$geography == 'state') {
    state = NULL
  } else {
    state = body$state
  }
  
  # prep the filter statement from query results
  expressions <- body$queries |>
    mutate(
      operator_symbol = case_when(
        operator == 'equal' ~ '==',
        operator == 'greater' ~ '>',
        operator == 'less' ~ '<',
        operator == 'greaterThanEqual' ~ '>=',
        operator == 'lessThanEqual' ~ '<='
      ),
      query_column = if_else(numberType == 'percent', 'percent', 'estimate'),
      expression = glue('{numberType}_{variable} {operator_symbol} {value}')
    )
  
  if (body$queryType == 'all') {
    selection_statement = paste(expressions$expression, collapse = ' & ')
  } else { # any
    selection_statement = paste(expressions$expression, collapse = ' | ')
  }

  # get data and prep the data
  data <- get_acs(
    geography = body$geography,
    survey    = body$survey,
    variables = body$variables,
    state     = state,
    year      = 2020,
    cache     = TRUE
  ) |>
    # filter(GEOID == body$geoid) |>
    mutate(var_group = str_extract(variable, '^[^_]+(?=_)')) |>
    group_by(GEOID, var_group) |>
    mutate(group_max = max(estimate)) |>
    ungroup() |>
    mutate(percent = 100 * (estimate / group_max),
           moe_perc = 100 * (moe / estimate)) |>
    select(-NAME, -group_max, -var_group) |>
    # pivot wider makes it easier for querying
    pivot_wider(values_from = c(estimate, percent, moe, moe_perc), names_from=variable) |>
    # smoosh the rows together by GEOID
    group_by(GEOID) |>
    fill(everything(), .direction = "downup") |>
    slice(1) |>
    # now do the final query to filter the data we want
    filter(rlang::eval_tidy(rlang::parse_expr(selection_statement))) |>
    rename(geoid = GEOID)
  
  # print(selection_statement)
  # data <- data |>
  #   filter(rlang::eval_tidy(rlang::parse_expr(selection_statement)))

  variables <- paste(body$variables, collapse = "','")
  query_res <- dbGetQuery(con, glue("SELECT * FROM acs5_2020_vars WHERE name IN ('{variables}')")) |>
    mutate(full_label = glue('{concept} - {label}'))
  print('**********************')
  print(query_res$name)
  print('**********************')
  columns = colnames(data)
  print(columns)
  for (column in columns) {
    stripped <- str_replace(column, 'estimate_|percent_|moe_perc_|moe_', '')
    idx <- which(columns == column)
    match <- filter(query_res, name == stripped)
    if (str_starts(column, 'percent')) {
      colnames(data)[idx] = glue('{match$full_label} (%)')
    } else if (str_starts(column, 'estimate')) {
      colnames(data)[idx] = match$full_label
    } else if (str_starts(column, 'moe_perc')) {
      colnames(data)[idx] = glue('{match$full_label} (MoE)')
    } else if (str_starts(column, 'moe_')) {
      colnames(data)[idx] = glue('{match$full_label} (MoE %)')
    }
  }

  geoids <- paste(data$geoid, collapse="','")
  get_geoids_statement = glue("select * from states where geoid IN ('{geoids}')")
  print(get_geoids_statement)
  sf::st_read(con, query = get_geoids_statement) |>
    left_join(data, by = 'geoid') |>
    select(-geoid, -stusps) |>
    geojsonsf::sf_geojson(digits=5)
}

# test_req = list(
#   body = list(
#     geography = 'acs5',
#     year = '2020',
#     geography = 'state',
#     queryType = 'all',
#     state = 'AL',
#     variables = c("B01001_009", "B01001_006"),
#     queries = c(
#       list(variable = "B01001_009", numberType = "percent", value = "4", operator = "greater"),
#       list(variable = "B01001_006", numberType = "percent", value = "5", operator = "greater")
#     )
#   )
# )
query_dec_post <- function(req) {
}

# example calls
# {
#     "dataset": "acs5",
#     "activeYear": "2020",
#     "activeGeom": "state",
#     "activeState": "AL",
#     "queryType": "all",
#     "variables": ["B01001_009", "B01001_006"],
#     "queries": [
#         {"variable": "B01001_009", "numberType": "percent", "value": "4", "operator": "greater"},
#         {"variable": "B01001_006", "numberType": "percent", "value": "0", "operator": "greater"}
#     ]
# }