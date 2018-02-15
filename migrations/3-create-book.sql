CREATE TABLE books (
    id_pk           SERIAL      PRIMARY KEY,
    name            TEXT        NOT NULL,
    description     TEXT,
    uses_count      INTEGER     DEFAULT 0,
    author_id       INTEGER     REFERENCES authors(id_pk),
    created_at      TIMESTAMP   DEFAULT LOCALTIMESTAMP
);