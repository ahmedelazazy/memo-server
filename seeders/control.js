'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // user.addProject(project, { through: { status: 'started' } });

    // console.log(Sequelize);
    return queryInterface.bulkInsert(
      'Controls',
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

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
