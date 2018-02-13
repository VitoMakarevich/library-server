const {author: AuthorModel, sequelize} = require('../models');

const create = async (fields) => {
    const author = await AuthorModel.create({firstName: fields.firstName, lastName: fields.lastName});
    return author.dataValues;
}

const read = async ({firstName = "", lastName = ""}) => {
    const { Op } = sequelize;
    const filter = {
        where: {
            firstName: {
                [Op.iLike]: `%${firstName}%`
            },
            lastName: {
                [Op.iLike]: `%${lastName}%`
            }
        }
    }
    let authors = await AuthorModel.findAll(filter);
    authors = authors.map((element) => element.dataValues);
    return authors;
}

module.exports = {
    create,
    read
}