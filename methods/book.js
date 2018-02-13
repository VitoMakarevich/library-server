const { book: BookModel, author: AuthorModel, sequelize } = require('../models');

const bookMethods = {};

bookMethods.create = async ({ name, description, author }) => {
    const query = {
        name,
        description,
        author
    }
    console.log(1)
    console.log(BookModel);
    const book = await BookModel.create(query);
    console.log(book)
    return book.dataValues;
}

bookMethods.read = async ({ 
    name = "",
    description = "",
    author = "",
    limit = 10,
    offset = 0,
    orderField = "first_name",
    orderDirection = "DESC"
}) => {
    const { Op } = sequelize;
    const filter = {
        where: {
            name: {
                [Op.iLike]: `%${firstName}%`
            },
            description: {
                [Op.iLike]: `%${lastName}%`
            },
            author: {
                [Op.any]: author.findAll({
                    where: {
                        firstName: {
                            [Op.iLike]: `%${author}%`
                        }
                    },
                    attributes: ['id']
                })
            }
        },
        limit,
        offset,
        order: [[orderField, orderDirection]]
    }
    let books = await BookModel.findAll(filter);
    books = books.map((element) => element.dataValues);
    return books;
}

bookMethods.update = async ({id, description, author}) => {
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
        name: sequelize.fn('COALESCE', name, sequelize.col('name')),
        description: sequelize.fn('COALESCE', description, sequelize.col('description')),
        author: sequelize.fn('COALESCE', author, sequelize.col('author')),
    }

    const newbook = await BookModel.update(query, filter);

    if(newbook[AFFECTED_ITEMS_COUNT_ARRAY_INDEX] === 0) return {};
    const result = newbook[1][0].dataValues || DEFAULT_VALUE;
    return result;
}

bookMethods.delete = async ({id}) => {
    const filter = {
        where: {
            id
        }
    };

    const deletedRowsCount = BookModel.destroy(filter);

    return deletedRowsCount;
}

module.exports = bookMethods;