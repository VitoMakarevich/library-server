const sqls = {};

sqls.deleteAll = `TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
sqls.create = `INSERT INTO users(
                    first_name,
                    last_name,
                    email,
                    passport_number
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                )
                RETURNING
                    id_pk           AS "id",
                    first_name      AS "firstName",
                    last_name       AS "lastName",
                    created_at      AS "createdAt",
                    email           AS "email",
                    passport_number AS "passportNumber",
                    (SELECT
                        count(*)::int
                    FROM
                        bindings
                    WHERE
                        user_id = users.id_pk
                    )               AS "usedBooksCount";`

sqls.readOne = `SELECT
                    id_pk           AS "id",
                    first_name      AS "firstName",
                    last_name       AS "lastName",
                    created_at      AS "createdAt",
                    email           AS "email",
                    passport_number AS "passportNumber",
                    (SELECT
                        count(*)::int
                    FROM
                        bindings
                    WHERE
                        user_id = users.id_pk
                    AND
                        finished_at IS NOT NULL
                    )               AS "usedBooksCount",
                    (SELECT
                        count(*)::int
                    FROM
                        bindings
                    WHERE
                        user_id = users.id_pk
                    AND
                        finished_at IS NULL
                    )               AS "currentBooksUsed"
                FROM 
                    users
                WHERE
                    id_pk = $1`;

sqls.readCount = (firstName, lastName, passportNumber, email) => { 
    let sqlFilter = [];
    if(firstName && firstName.length) {
        sqlFilter.push(`first_name ilike '%${firstName}%'`);
    }
    if(lastName && lastName.length) {
        sqlFilter.push(`last_name ilike '%${lastName}%'`);
    } 
    if(email && email.length) {
        sqlFilter.push(`email ilike '%${email}%'`);
    } 
    if(passportNumber && passportNumber.length) {
        sqlFilter.push(`passport_number ilike '%${passportNumber}%'`);
    } 
    let sqlQuery;
    if(sqlFilter.length)
        sqlQuery = "WHERE " + sqlFilter.join(' AND ');
    else {
        sqlQuery = "";
    }

    return `SELECT
        count(*)::int
    FROM
        users
    ${sqlQuery}
    ;`;
}
sqls.readAll = (firstName, lastName, passportNumber, email, orderField, orderDirection) => { 
    let sqlFilter = [];
    if(firstName && firstName.length) {
        sqlFilter.push(`first_name ilike '%${firstName}%'`);
    }
    if(lastName && lastName.length) {
        sqlFilter.push(`last_name ilike '%${lastName}%'`);
    } 
    if(email && email.length) {
        sqlFilter.push(`email ilike '%${email}%'`);
    } 
    if(passportNumber && passportNumber.length) {
        sqlFilter.push(`passport_number ilike '%${passportNumber}%'`);
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
        email                    AS "email",
        passport_number          AS "passportNumber",
        created_at               AS "createdAt",
        (SELECT 
            count(*)
        FROM 
            bindings
        WHERE bindings.user_id = users.id_pk)::int AS "usedBooksCount"
    FROM
        users
    ${sqlQuery}
    ORDER BY
        ${orderField} ${orderDirection}
    LIMIT  $1
    OFFSET $2
    ;`;
}

// sqls.readOne = `SELECT
//                     id_pk                    AS "id",
//                     first_name               AS "firstName",
//                     last_name                AS "lastName",
//                     created_at               AS "createdAt",
//                     (SELECT 
//                         count(*)
//                     FROM 
//                         books
//                     WHERE author_id = id_pk)::int AS "booksCount",
//                     (SELECT 
//                         COALESCE(json_agg(t), json_build_array())
//                     FROM
//                         (SELECT 
//                             id_pk AS "id",
//                             name  AS "name",
//                             description AS "description",
//                             uses_count  AS "usesCount",
//                             created_at  AS "createdAt"
//                         FROM
//                             books
//                         WHERE 
//                             author_id = books.id_pk
//                         ) AS "t"
//                     ) AS "books"
//                 FROM
//                     authors
//                 WHERE
//                    id_pk = $1
//                 ;`

sqls.update =   `UPDATE
                    users
                SET
                    first_name = COALESCE($2, first_name),
                    last_name  = COALESCE($3, last_name),
                    passport_number = COALESCE($4, passport_number),
                    email      = COALESCE($5, email)
                WHERE
                    id_pk = $1
                RETURNING
                    id_pk                    AS "id",
                    first_name               AS "firstName",
                    last_name                AS "lastName",
                    email                    AS "email",
                    passport_number          AS "passportNumber",
                    created_at               AS "createdAt",
                    (SELECT 
                        count(*)
                    FROM 
                        bindings
                    WHERE bindings.user_id = users.id_pk)::int AS "usedBooksCount"`;

sqls.delete = ` DELETE FROM
                    users
                WHERE
                    id_pk = $1
                RETURNING
                id_pk                    AS "id"`;

module.exports = sqls;