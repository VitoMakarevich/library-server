const {author: AuthorModel, sequelize} = require('../models');

const authorMethods = {};

authorMethods.create = async ({firstName, lastName}) => {
    const query = {
        firstName,
        lastName
    }
    const author = await AuthorModel.create(query);
    return author.dataValues;
}

authorMethods.read = async ({firstName = "",
                     lastName = "",
                     limit = 10,
                     offset = 0,
                     orderField = "first_name",
                     orderDirection = "DESC"
                    }) => {
    const { Op } = sequelize;
    const filter = {
        where: {
            firstName: {
                [Op.iLike]: `%${firstName}%`
            },
            lastName: {
                [Op.iLike]: `%${lastName}%`
            }
        },
        limit,
        offset,
        order: [[orderField, orderDirection]]
    }
    let authors = await AuthorModel.findAll(filter);
    authors = authors.map((element) => element.dataValues);
    return authors;
}

authorMethods.update = async ({id, firstName, lastName}) => {
    const AFFECTED_ITEMS_ARRAY_INDEX = 1;
    const AFFECTED_ITEMS_COUNT_ARRAY_INDEX = 0;
    const FIRST_AFFECTED_ITEM_INDEX = 0;
    const DEFAULT_VALUE = {};

    const { Op } = sequelize;

    const filter = {
        where: {
            id
        },
        returning: true
    };
    const query = {
        firstName: sequelize.fn('COALESCE', firstName, sequelize.col('first_name')),
        lastName: sequelize.fn('COALESCE', lastName, sequelize.col('last_name'))
    }

    const newAuthor = await AuthorModel.update(query, filter);

    if(newAuthor[AFFECTED_ITEMS_COUNT_ARRAY_INDEX] === 0) return {};
    const result = newAuthor[1][0].dataValues || DEFAULT_VALUE;
    return result;
}

authorMethods.delete = async ({id}) => {
    const filter = {
        where: {
            id
        }
    };

    const deletedRowsCount = AuthorModel.destroy(filter);

    return deletedRowsCount;
}

module.exports = authorMethods;