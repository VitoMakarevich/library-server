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
    if(orderField) orderField = orderField.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.readAll(name, description, orderField, orderDirection), [limit, offset])).rows;
    const count = (await client.query(sqls.readCount(name,description))).rows[0].count;
    db.close(client);
    return {books: findedRows, numItems: count};
}


bookMethods.readOne = async ({id}) => {
    const client = await(db.connect());
    const book = (await client.query(sqls.readOne, [id])).rows[0] || {};
    db.close(client);
    return book;
};


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