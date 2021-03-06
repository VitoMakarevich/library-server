const { db } = require('../utils');

const authorMethods = {};

const sqls = require('./sqls').author;

authorMethods.create = async ({firstName, lastName}) => {
    const client = await(db.connect());
    const createdRow = (await client.query(sqls.create, [firstName, lastName])).rows[0];
    db.close(client);
    return createdRow;
}

authorMethods.deleteAll = async () => {
    const client = await(db.connect());
    const deletedRows = await client.query(sqls.deleteAll);
    db.close(client);
    return deletedRows;
};

authorMethods.readAll = async ({firstName, lastName, limit = 10, offset = 0, orderField = "first_name", orderDirection = "asc" }) => {
    if(orderField) orderField = orderField.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.readAll(orderField, orderDirection, firstName, lastName), [limit, offset])).rows;
    const count = (await client.query(sqls.readCount(firstName, lastName))).rows[0].count;
    db.close(client);
    return {authors: findedRows, numItems: count};
}

authorMethods.readOne = async ({id}) => {
    const client = await(db.connect());
    const author = (await client.query(sqls.readOne, [id])).rows[0] || {};
    db.close(client);
    return author;
};

authorMethods.update = async ({id, firstName, lastName}) => {
    const client = await(db.connect());
    const author = (await client.query(sqls.update, [id, firstName, lastName])).rows[0] || {};
    db.close(client);
    return author;
}

authorMethods.delete = async ({id}) => {
    const client = await(db.connect());
    const author = (await client.query(sqls.delete, [id])).rows[0] || {};
    db.close(client);
    return author;
}

module.exports = authorMethods;