'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('authors', [{
        first_name: 'John',
        last_name: 'Doe'
      },
      {
        first_name: 'Vito',
        last_name: 'Mak'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('authors', null, {});
  }
};
