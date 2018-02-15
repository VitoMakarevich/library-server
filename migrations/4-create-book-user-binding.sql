CREATE TABLE bindings (
    id_pk           SERIAL      PRIMARY KEY,
    user_id         INTEGER     NOT NULL REFERENCES users(id_pk),
    book_id         INTEGER     NOT NULL REFERENCES books(id_pk),
    created_at      TIMESTAMP   DEFAULT LOCALTIMESTAMP,
    finished_at     TIMESTAMP
);