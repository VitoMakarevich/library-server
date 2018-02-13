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
    const FIRST_AFFECTED_ITEM_INDEX = 0;
    const DEFAULT_VALUE = {};

    const { Op } = sequelize;
    const filter = {
        where: {
            id
        },
        returning: true
    };
    

    let oldAuthor = (await AuthorModel.findById(id));
    
    if(oldAuthor === null) return {};

    oldAuthor = oldAuthor.dataValues;

    const query = {
        firstName: firstName || oldAuthor.firstName,
        lastName: lastName || oldAuthor.lastName
    }

    const newAuthor = await AuthorModel.update(query, filter);

    let result;

    if(newAuthor[AFFECTED_ITEMS_ARRAY_INDEX] || newAuthor[1][FIRST_AFFECTED_ITEM_INDEX])
        result = newAuthor[AFFECTED_ITEMS_ARRAY_INDEX][FIRST_AFFECTED_ITEM_INDEX].dataValues || DEFAULT_VALUE;

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