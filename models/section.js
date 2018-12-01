'use strict';
module.exports = (sequelize, DataTypes) => {
  var section = sequelize.define('section', {
    label: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER }
  });

  section.associate = function(models) {
    models.section.belongsTo(models.template);
    models.section.hasMany(models.control);
  };

  return section;
};
