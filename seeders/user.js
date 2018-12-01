'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'User 1',
          email: 'user1@mail.com',
          password: '123456'
        },
        {
          name: 'User 2',
          email: 'user2@mail.com',
          password: '123456'
        },
        {
          name: 'User 3',
          email: 'user3@mail.com',
          password: '123456'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {}
};
