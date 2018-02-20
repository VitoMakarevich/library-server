const { db } = require('../utils');

const bookMethods = {};

const sqls = require('./sqls').book;

bookMethods.create = async ({name, description, authorId}) => {
    const client = await(db.connect());
    const createdRow = (await client.query(sqls.create, [name, description, authorId])).rows[0];
    db.close(client);
    return createdRow;
}

bookMethods.deleteAll = async () => {
    const client = await(db.connect());
    const deletedRows = await client.query(sqls.deleteAll);
    db.close(client);
    return deletedRows;
};

bookMethods.readAll = async ({ name = "", description = "", limit = 10, offset = 0, orderField = "name", orderDirection = "DESC"}) => {
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.readAll(name, description, orderField, orderDirection), [limit, offset])).rows;
    db.close(client);
    return findedRows;
}

bookMethods.update = async ({id, name, description, authorId}) => {
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.update(authorId), [id, name, description, authorId])).rows[0] || {};
    db.close(client);
    return findedRows;
}

bookMethods.delete = async ({id}) => {
    const client = await(db.connect());
    const deletedId = (await client.query(sqls.delete, [id])).rows[0] || {};
    db.close(client);
    return deletedId;
}

module.exports = bookMethods;