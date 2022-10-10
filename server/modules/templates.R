templates_vars_get <- function(con, id) {
    query <- glue("
        SELECT b.var, b.year, b.survey 
        FROM templates a
        INNER JOIN template_vars b
            ON b.template_id = a.id
        WHERE a.id = {id}
    ")
    dbGetQuery(con, query)
}

templates_get <- function(con, category) {
    if (category == 'primary') {
        query <- "SELECT id, title FROM templates WHERE template_type = 'primary';"
    } else if (category == 'custom') {
        query <- "SELECT id, title FROM templates WHERE template_type = 'custom';"
    } else if (category == 'all') {
        query <- "SELECT id, title FROM templates;"
    } else {
        stop('Invalid parameters')
    }

    dbGetQuery(con, query)
}