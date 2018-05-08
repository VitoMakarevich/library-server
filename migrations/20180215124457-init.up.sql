CREATE TABLE authors (
    id_pk       SERIAL      PRIMARY KEY,
    first_name  TEXT        NOT NULL,
    last_name   TEXT        NOT NULL,
    created_at  TIMESTAMP   DEFAULT LOCALTIMESTAMP
);

CREATE TABLE users (
    id_pk           SERIAL      PRIMARY KEY,
    first_name      TEXT        NOT NULL,
    last_name       TEXT        NOT NULL,
    email           TEXT,
    passport_number TEXT        NOT NULL,
    created_at      TIMESTAMP   DEFAULT LOCALTIMESTAMP
);

CREATE TABLE books (
    id_pk           SERIAL      PRIMARY KEY,
    name            TEXT        NOT NULL,
    description     TEXT,
    uses_count      INTEGER     DEFAULT 0,
    author_id       INTEGER     REFERENCES authors(id_pk) ON DELETE SET NULL,
    created_at      TIMESTAMP   DEFAULT LOCALTIMESTAMP
);

CREATE TABLE bindings (
    id_pk           SERIAL      PRIMARY KEY,
    user_id         INTEGER     NOT NULL REFERENCES users(id_pk) ON DELETE CASCADE,
    book_id         INTEGER     NOT NULL REFERENCES books(id_pk) ON DELETE CASCADE,
    created_at      TIMESTAMP   DEFAULT LOCALTIMESTAMP,
    finished_at     TIMESTAMP
);