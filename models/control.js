'use strict';
module.exports = (sequelize, DataTypes) => {
  var control = sequelize.define('control', {
    label: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER },
    type: { type: DataTypes.ENUM('text', 'yes/no') },
    config: { type: DataTypes.TEXT },
    controlUiId: { type: DataTypes.STRING }
  });

  control.associate = function(models) {
    models.control.belongsTo(models.section);
    models.control.belongsTo(models.template);
  };

  return control;
};
