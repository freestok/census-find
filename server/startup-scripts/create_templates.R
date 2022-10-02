library(glue)
library(tidyverse)
library(dbplyr)

create_templates <- function(con) {
   query <- glue("
    CREATE TABLE templates (
        id serial PRIMARY KEY,
        title text NOT NULL
    );
    CREATE TABLE template_vars (
        template_id integer,
        var text,
        PRIMARY KEY(template_id),
        CONSTRAINT fk_templates 
            FOREIGN KEY(template_id) 
            REFERENCES templates(id)
    );  
   ") 
    dbExecute(con, query)
}
