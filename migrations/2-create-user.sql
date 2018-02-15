CREATE TABLE users (
    id_pk           SERIAL      PRIMARY KEY,
    first_name      TEXT        NOT NULL,
    last_name       TEXT        NOT NULL,
    email           TEXT,
    passport_number TEXT        NOT NULL,
    created_at      TIMESTAMP   DEFAULT LOCALTIMESTAMP
);