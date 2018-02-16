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

authorMethods.readAll = async ({
                     firstName,
                     lastName,
                     limit = 10,
                     offset = 0,
                     orderField = "first_name",
                     orderDirection = "asc"
                    }) => {
    const client = await(db.connect());


    const findedRows = (await client.query(sqls.readAll(orderField, orderDirection), [firstName, lastName, limit, offset])).rows;
    db.close(client);
    return findedRows;
}

// authorMethods.update = async ({id, firstName, lastName}) => {
//     const AFFECTED_ITEMS_ARRAY_INDEX = 1;
//     const AFFECTED_ITEMS_COUNT_ARRAY_INDEX = 0;
//     const FIRST_AFFECTED_ITEM_INDEX = 0;
//     const DEFAULT_VALUE = {};

//     const { Op } = sequelize;

//     const filter = {
//         where: {
//             id
//         },
//         returning: true
//     };
//     const query = {
//         firstName: sequelize.fn('COALESCE', firstName, sequelize.col('first_name')),
//         lastName: sequelize.fn('COALESCE', lastName, sequelize.col('last_name'))
//     }

//     const newAuthor = await AuthorModel.update(query, filter);

//     if(newAuthor[AFFECTED_ITEMS_COUNT_ARRAY_INDEX] === 0) return {};
//     const result = newAuthor[1][0].dataValues || DEFAULT_VALUE;
//     return result;
// }

// authorMethods.delete = async ({id}) => {
//     const filter = {
//         where: {
//             id
//         }
//     };

//     const deletedRowsCount = AuthorModel.destroy(filter);

//     return deletedRowsCount;
// }

module.exports = authorMethods;