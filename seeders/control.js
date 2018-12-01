'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'controls',
      [
        {
          label: 'Control 1.1 @ Section 1',
          SectionId: 1
        },
        {
          label: 'Control 1.2 @ Section 1',
          SectionId: 1
        },
        {
          label: 'Control 2.1 @ Section 2',
          SectionId: 2
        },
        {
          label: 'Control 2.2 @ Section 2',
          SectionId: 2
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {}
};
