'use strict';
module.exports = (sequelize, DataTypes) => {
  var Section = sequelize.define('Section', {
    label: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER },
  });

  Section.associate = function(models) {
    models.Section.belongsTo(models.Template);
    models.Section.hasMany(models.Control);
  };

  return Section;
};
