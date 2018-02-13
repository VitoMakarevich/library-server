const { user: UserModel, sequelize } = require('../models');

const userMethods = {};

userMethods.create = async ({ firstName, lastName, email, passportNumber }) => {
    const query = {
        firstName,
        lastName,
        email,
        passportNumber
    }
    const user = await UserModel.create(query);
    return user.dataValues;
}

userMethods.read = async ({ 
    firstName = "",
    lastName = "",
    passportNumber = "",
    email = "",
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
            },
            email: {
                [Op.iLike]: `%${email}%`
            },
            passportNumber: {
                [Op.iLike]: `%${passportNumber}%`
            }
        },
        limit,
        offset,
        order: [[orderField, orderDirection]]
    }
    let users = await UserModel.findAll(filter);
    users = users.map((element) => element.dataValues);
    return users;
}

userMethods.update = async ({id, firstName, lastName, passportNumber, email}) => {
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
        lastName: sequelize.fn('COALESCE', lastName, sequelize.col('last_name')),
        email: sequelize.fn('COALESCE', email, sequelize.col('email')),
        passportNumber: sequelize.fn('COALESCE', passportNumber, sequelize.col('passport_number'))
    }

    const newUser = await UserModel.update(query, filter);

    if(newUser[AFFECTED_ITEMS_COUNT_ARRAY_INDEX] === 0) return {};
    const result = newUser[1][0].dataValues || DEFAULT_VALUE;
    return result;
}

userMethods.delete = async ({id}) => {
    const filter = {
        where: {
            id
        }
    };

    const deletedRowsCount = UserModel.destroy(filter);

    return deletedRowsCount;
}

module.exports = userMethods;