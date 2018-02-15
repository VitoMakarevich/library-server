CREATE TABLE authors (
    id_pk       SERIAL      PRIMARY KEY,
    first_name  TEXT        NOT NULL,
    last_name   TEXT        NOT NULL,
    created_at  TIMESTAMP   DEFAULT LOCALTIMESTAMP
);