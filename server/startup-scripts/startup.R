# installed libraries
library(here)
library(RPostgres)
library(dbplyr)
library(pool)

# import custom functions
source("cache_geoms.R")
source("cache_variables.R")
source("cache_materialized_views.R")
source("create_templates.R")

# get the environment variables
readRenviron('.Renviron')

# connect to the database
db <- Sys.getenv("postgres_db")
port <- Sys.getenv("postgres_port")
user <- Sys.getenv("postgres_user")
pw <- Sys.getenv("postgres_pw")
con <- dbPool(
  RPostgres::Postgres(),
  dbname = db,
  port = port,
  user = user,
  password = pw
)

# cache the geoms
cache_geoms(con)

# cache the variables
cache_vars('acs5', '2020', 1, con)
cache_vars('sf1', '2010', 0, con)
cache_vars('pl', '2020', 1, con)

# create the templates
create_templates(con)

# create the materialized views
cache_views('places', c('name', 'stusps'), con)
cache_views('tracts', c('name', 'stusps'), con)
cache_views('counties', c('name', 'stusps'), con)
