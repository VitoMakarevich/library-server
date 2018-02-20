const sqls = {};

sqls.deleteAll = `TRUNCATE TABLE books RESTART IDENTITY CASCADE`;
sqls.create = `INSERT INTO books(
                    name,
                    description,
                    author_id
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )
                RETURNING
                    id_pk           AS "id",
                    name            AS "name",
                    description     AS "description",
                    created_at      AS "createdAt",
                    uses_count      AS "usesCount",
                    author_id       AS "authorId";`
sqls.readAll = (name, description, orderField, orderDirection) => { 
    let sqlFilter = [];
    if(name && name.length) {
        sqlFilter.push(`name ilike '%${name}%'`);
    }
    if(description && description.length) {
        sqlFilter.push(`description ilike '%${description}%'`);
    } 
    let sqlQuery;
    if(sqlFilter.length)
        sqlQuery = "WHERE " + sqlFilter.join(' AND ');
    else {
        sqlQuery = "";
    }

    return `SELECT
            id_pk                    AS "id",
            name                     AS "name",
            description              AS "description",
            created_at               AS "createdAt",
            author_id                AS "authorId",
            uses_count               AS "usesCount",
            (SELECT
                row_to_json(t)
                FROM
                (SELECT
                    id_pk                    AS "id",
                    first_name               AS "firstName",
                    last_name                AS "lastName",
                    created_at               AS "createdAt"
                FROM 
                    authors
                WHERE
                    authors.id_pk = books.author_id
                ) AS t
            ) AS "author"
            FROM
                books
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

sqls.update =  (authorId) => {
    const authorStr = authorId ? `author_id = ${authorId}` : '';
            return `UPDATE
                    books AS "auth"
                SET
                    name = COALESCE($2, name),
                    description  = COALESCE($3, description),
                    author_id = COALESCE($4, author_id)
                WHERE
                    id_pk = $1
                RETURNING
                    id_pk                    AS "id",
                    name                     AS "name",
                    description              AS "description",
                    created_at               AS "createdAt",
                    author_id                AS "authorId",
                    uses_count               AS "usesCount"`
};

sqls.delete = ` DELETE FROM
                    books AS "books"
                WHERE
                    id_pk = $1
                RETURNING
                    id_pk                    AS "id"`;

module.exports = sqls;