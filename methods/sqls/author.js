const sqls = {};

sqls.deleteAll = `TRUNCATE TABLE authors RESTART IDENTITY CASCADE`;
sqls.create = `INSERT INTO authors(
                    first_name,
                    last_name
                )
                VALUES (
                    $1,
                    $2
                )
                RETURNING
                    id_pk      AS "id",
                    first_name AS "firstName",
                    last_name  AS "lastName",
                    created_at AS "createdAt";`
sqls.readAll = (orderField, orderDirection, firstName, lastName) => { 
    let sqlFilter = [];
    if(firstName && firstName.length) {
        sqlFilter.push(`first_name ilike '%${firstName}%'`);
    }
    if(lastName && lastName.length) {
        sqlFilter.push(`last_name ilike '%${lastName}%'`);
    } 
    let sqlQuery;
    if(sqlFilter.length)
        sqlQuery = "WHERE " + sqlFilter.join(' AND ');
    else {
        sqlQuery = "";
    }

    return `SELECT
        id_pk                    AS "id",
        first_name               AS "firstName",
        last_name                AS "lastName",
        created_at               AS "createdAt",
        (SELECT 
            count(*)
        FROM 
            books
        WHERE author_id = auth.id_pk)::int AS "booksCount"
    FROM
        authors AS auth
    ${sqlQuery}
    ORDER BY
        ${orderField} ${orderDirection}
    LIMIT  $1
    OFFSET $2
    ;`;
}

sqls.readOne = `SELECT
                    id_pk                    AS "id",
                    first_name               AS "firstName",
                    last_name                AS "lastName",
                    created_at               AS "createdAt",
                    (SELECT 
                        count(*)
                    FROM 
                        books
                    WHERE author_id = id_pk)::int AS "booksCount",
                    (SELECT 
                        json_agg(t)
                    FROM
                        (SELECT 
                            id_pk AS "id",
                            name  AS "name",
                            description AS "description",
                            uses_count  AS "uses_count",
                            created_at  AS "createdAt"
                        FROM
                            books
                        WHERE 
                            author_id = books.id_pk
                        ) AS "t"
                    ) AS "books"
                FROM
                    authors
                WHERE
                   id_pk = $1
                ;`

sqls.update =   `UPDATE
                    authors AS "auth"
                SET
                    first_name = COALESCE($2, first_name),
                    last_name  = COALESCE($3, last_name)
                WHERE
                    id_pk = $1
                RETURNING
                    id_pk                    AS "id",
                    first_name               AS "firstName",
                    last_name                AS "lastName",
                    created_at               AS "createdAt",
                    (SELECT 
                        count(*)
                    FROM 
                        books
                    WHERE author_id = auth.id_pk)::int AS "booksCount"`;

sqls.delete = ` DELETE FROM
                    authors AS "auth"
                WHERE
                    id_pk = $1
                RETURNING
                    id_pk                    AS "id",
                    first_name               AS "firstName",
                    last_name                AS "lastName",
                    created_at               AS "createdAt",
                    (SELECT 
                        count(*)
                    FROM 
                        books
                    WHERE author_id = auth.id_pk)::int AS "booksCount"`;

module.exports = sqls;