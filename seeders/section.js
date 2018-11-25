'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Sections',
      [
        {
          label: 'Section 1 @ T1',
          TemplateId: 1
        },
        {
          label: 'Section 2 @ T1',
          TemplateId: 1
        },
        {
          label: 'Section 1 @ T2',
          TemplateId: 2
        },
        {
          label: 'Section 2 @ T2',
          TemplateId: 2
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
