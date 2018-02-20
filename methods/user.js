const { db } = require('../utils');

const userMethods = {};

const sqls = require('./sqls').user;


userMethods.deleteAll = async() => {
    const client = await(db.connect());
    const deletedRows = await client.query(sqls.deleteAll);
    db.close(client);
    return deletedRows;
}
userMethods.create = async ({firstName, lastName, email = "", passportNumber = ""}) => {
    const client = await(db.connect());
    const deletedRows = (await client.query(sqls.create, [firstName, lastName, email, passportNumber])).rows[0];
    db.close(client);
    return deletedRows;
}

userMethods.read = async ({ firstName = "", lastName = "", passportNumber = "", email = "", limit = 10, offset = 0, orderField = "first_name", orderDirection = "DESC"}) => {
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.readAll(firstName, lastName, passportNumber, email, orderField, orderDirection), [limit, offset])).rows;
    db.close(client);
    return findedRows;
}

userMethods.update = async ({id, firstName, lastName, passportNumber, email}) => {
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.update, [id, firstName, lastName, passportNumber, email])).rows[0] || {};
    db.close(client);
    return findedRows;
}
userMethods.delete = async ({id}) => {
    const client = await(db.connect());
    const findedRows = (await client.query(sqls.delete, [id])).rows[0] || {};
    db.close(client);
    return findedRows;
}

module.exports = userMethods;