library(plumber)
library(here)
readRenviron(here('.Renviron'))

source(here('modules', '__helper.R'))
con <- get_con()

port <- Sys.getenv("plumber_port")
plumb_file <- here('plumber.R')
pr <- plumb(plumb_file) 

pr$registerHooks(
  list(
    "exit" = function() {
      poolClose(con)
    }
  )
)

pr_run(pr, port=strtoi(port))