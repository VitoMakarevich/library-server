const {author: AuthorModel, sequelize} = require('../models');

const create = async (fields) => {
    const author = await AuthorModel.create({firstName: fields.firstName, lastName: fields.lastName});
    return author.dataValues;
}

const read = async ({firstName = "",
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

const update = async ({id, firstName, lastName}) => {
    const { Op } = sequelize;
    const filter = {
        where: {
            id
        },
        returning: true
    };
    

    const oldAuthor = (await AuthorModel.findById(id)).dataValues;

    const query = {
        firstName: firstName || oldAuthor.firstName,
        lastName: lastName || oldAuthor.lastName
    }

    const newAuthor = await AuthorModel.update(query, filter);

    let result;

    if(newAuthor[1] || newAuthor[1][0])
        result = newAuthor[1][0].dataValues || [];

    return result;
}

module.exports = {
    create,
    read,
    update
}