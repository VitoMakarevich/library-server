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

sqls.readAll = (orderField, orderDirection) => { 
    return `SELECT
                id_pk       AS "id",
                user_id     AS "userId",
                book_id     AS "bookId",
                created_at  AS "createdAt",
                finished_at AS "finishedAt"
            FROM
                bindings
            ORDER BY
                ${orderField} ${orderDirection}
            LIMIT $1
            OFFSET $2;`
}

sqls.finishBinding = `UPDATE
                        bindings
                      SET
                        finished_at = localtimestamp
                      WHERE 
                        id_pk = $1
                      RETURNING
                        id_pk AS "id";`

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