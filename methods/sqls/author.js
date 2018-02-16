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
sqls.readAll = (orderField, orderDirection) => `SELECT
                    id_pk                    AS "id",
                    first_name               AS "firstName",
                    last_name                AS "lastName",
                    created_at               AS "createdAt",
                    (SELECT 
                        count(*)
                    FROM 
                        books
                    WHERE author_id = id_pk)::int AS "booksCount"
                FROM
                    authors
                WHERE
                    CASE 
                        WHEN $1::text IS NULL THEN TRUE
                        ELSE first_name ilike '%($1::text)%'
                    END
                    AND
                    CASE 
                        WHEN $2::text IS NULL THEN TRUE
                        ELSE last_name ilike '%($2::text)%'
                    END
                ORDER BY
                    ${orderField} ${orderDirection}
                LIMIT  $3
                OFFSET $4
                ;`;

module.exports = sqls;