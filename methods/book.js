const { book: BookModel, author: AuthorModel, sequelize } = require('../models');

const bookMethods = {};

bookMethods.create = async ({ name, description, author: authorId }) => {
    const query = {
        name,
        description
    };
    const book = await BookModel.create(query);
    const author = await AuthorModel.findById(authorId);
    const bookWithAuthor = await book.setAuthor(author, {returning: true});
    const result = book.dataValues;
    result.author = (await bookWithAuthor.getAuthor()).dataValues;
    delete result.author_id;
    return result;
}

bookMethods.read = async ({ 
    name = "",
    description = "",
    author = "",
    limit = 10,
    offset = 0,
    orderField = "name",
    orderDirection = "DESC"
}) => {
    const { Op } = sequelize;
    const filter = {
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            },
            description: {
                [Op.iLike]: `%${description}%`
            },
        },
        limit,
        offset,
        order: [[orderField, orderDirection]],
        include: [
            { model: AuthorModel, required: true, as: 'author'}
        ],
    };
    let books
    try {
        books = await BookModel.findAll(filter);    
    } catch (error) {
        console.log('errror ', error)
    }
    
    books = books.map((book, index) => {
        let parsedBook = {};
        parsedBook = Object.assign(parsedBook, book.dataValues);
        parsedBook.author = book.dataValues.author.dataValues;
        delete parsedBook.author_id;
        return parsedBook;
    })
    
    return books;
}

bookMethods.update = async ({id, name, description}) => {
    const AFFECTED_ITEMS_ARRAY_INDEX = 1;
    const AFFECTED_ITEMS_COUNT_ARRAY_INDEX = 0;
    const FIRST_AFFECTED_ITEM_INDEX = 0;
    const DEFAULT_VALUE = {};

    const { Op } = sequelize;

    const filter = {
        where: {
            id
        },
        returning: true,
        include: [
            { model: AuthorModel, required: true, as: 'author'}
        ],
    };
    const query = {
        name: sequelize.fn('COALESCE', name, sequelize.col('name')),
        description: sequelize.fn('COALESCE', description, sequelize.col('description'))
    }

    const findedBook = await BookModel.find(filter);

    if(!findedBook) return {};

    const author = (await findedBook.getAuthor()).dataValues;

    const newbook = await findedBook.update(query, filter);
    const result = newbook.dataValues;
    delete result.author_id;

    result.author = author;
    return result;
}

bookMethods.delete = async ({id}) => {
    const filter = {
        where: {
            id
        }
    };
    const deletedRowsCount = await BookModel.destroy(filter);
    return deletedRowsCount;
}

module.exports = bookMethods;