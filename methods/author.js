const AuthorModel = require('../models').author;

const create = async (fields) => {
    const author = await AuthorModel.create({firstName: fields.firstName, lastName: fields.lastName});
    return author.dataValues;
}

module.exports = {
    create
}