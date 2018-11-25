'use strict';
module.exports = (sequelize, DataTypes) => {
  var Control = sequelize.define('Control', {
    label: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER },
    type: { type: DataTypes.ENUM('text', 'yes/no') },
    config: { type: DataTypes.TEXT },
    controlUiId: { type: DataTypes.STRING }
  });

  Control.associate = function(models) {
    models.Control.belongsTo(models.Section);
  };

  return Control;
};
