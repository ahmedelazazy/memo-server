'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'templates',
      [
        {
          title: 'Template 1',
          description: 'Template 1 desc',
          UserId: 1
        },
        {
          title: 'Template 2',
          description: 'Template 2 desc',
          UserId: 1
        },
        {
          title: 'Template 3',
          description: 'Template 3 desc',
          UserId: 2
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {}
};
