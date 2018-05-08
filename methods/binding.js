const { db } = require('../utils');

const bindingMethods = {};

const sqls = require('./sqls').binding;

bindingMethods.create = async ({bookId, userId}) => {
    const client = await(db.connect());
    const createdRow = (await client.query(sqls.create, [bookId, userId])).rows[0];
    db.close(client);
    return createdRow;
}

bindingMethods.deleteAll = async () => {
    const client = await(db.connect());
    const deletedRows = await client.query(sqls.deleteAll);
    db.close(client);
    return deletedRows;
};

bindingMethods.readAll = async ({ limit = 10, offset = 0, orderField = "created_at", orderDirection = "DESC"}) => {
    const client = await(db.connect());
    if(orderField) orderField = orderField.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
    const findedRows = (await client.query(sqls.readAll(orderField, orderDirection), [limit, offset])).rows;
    const count = (await client.query(sqls.readCount)).rows[0].count;
    db.close(client);
    return {bindings: findedRows, numItems: count};
}

bindingMethods.readOne = async ({id}) => {
    const client = await(db.connect());
    const bindings = (await client.query(sqls.readOne, [id])).rows[0] || {};
    db.close(client);
    return bindings;
};


bindingMethods.finish = async ({id}) => {
    const client = await(db.connect());
    const finishedCount = (await client.query(sqls.finishBinding, [id])).rows[0] || {};
    await client.query(sqls.updateUsesCount, [id]);
    db.close(client);
    return finishedCount;
}


module.exports = bindingMethods;