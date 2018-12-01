'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'steps',
      [
        {
          title: 'Step 1 @ T1',
          description: 'Step 1 desc',
          TemplateId: 1,
          UserId: 1
        },
        {
          title: 'Step 2 @ T1',
          description: 'Step 2 desc',
          TemplateId: 1,
          UserId: 1
        },
        {
          title: 'Step 1 @ T2',
          description: 'Step 1 desc',
          TemplateId: 2,
          UserId: 2
        },
        {
          title: 'Step 2 @ T2',
          description: 'Step 2 desc',
          TemplateId: 2,
          UserId: 2
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {}
};
