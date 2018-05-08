const sqls = {};

sqls.deleteAll = `TRUNCATE TABLE bindings RESTART IDENTITY CASCADE`;
sqls.create = `INSERT INTO bindings(
                    book_id,
                    user_id
                )
                VALUES (
                    $1,
                    $2
                )
                RETURNING
                    id_pk           AS "id",
                    user_id         AS "userId",
                    book_id         AS "bookId",
                    created_at      AS "createdAt",
                    finished_at     AS "finishedAt";`


sqls.readCount = `SELECT
                count(*)
            FROM
                bindings;`;

sqls.readAll = (orderField, orderDirection) => { 
    return `SELECT
                id_pk       AS "id",
                (SELECT
                    first_name || ' ' || last_name
                FROM
                    users
                WHERE users.id_pk = bindings.user_id)    AS "user",
                (SELECT
                    name
                FROM
                    books
                WHERE books.id_pk = bindings.book_id)    AS "book",
                created_at  AS "createdAt",
                finished_at AS "finishedAt"
            FROM
                bindings
            ORDER BY
                ${orderField} ${orderDirection}
            LIMIT $1
            OFFSET $2;`
}

sqls.readOne = `
SELECT
                id_pk       AS "id",
                (SELECT
                    first_name || ' ' || last_name
                FROM
                    users
                WHERE users.id_pk = bindings.user_id)    AS "user",
                (SELECT
                    name
                FROM
                    books
                WHERE books.id_pk = bindings.book_id)    AS "book",
                created_at  AS "createdAt",
                finished_at AS "finishedAt"
            FROM
                bindings
            WHERE
                id_pk = $1;
            `

sqls.finishBinding = `UPDATE
                        bindings
                      SET
                        finished_at = coalesce(finished_at, localtimestamp)
                      WHERE 
                        id_pk = $1
                      RETURNING
                        id_pk       AS "id",
                        (SELECT
                            first_name || ' ' || last_name
                        FROM
                            users
                        WHERE users.id_pk = bindings.user_id)    AS "user",
                        (SELECT
                            name
                        FROM
                            books
                        WHERE books.id_pk = bindings.book_id)    AS "book",
                        created_at  AS "createdAt",
                        finished_at AS "finishedAt";`

sqls.updateUsesCount = `UPDATE
                            books
                        SET
                            uses_count = uses_count + 1
                        WHERE 
                            id_pk = (SELECT
                                        book_id
                                    FROM
                                        bindings
                                    WHERE
                                        id_pk = $1);`

module.exports = sqls;