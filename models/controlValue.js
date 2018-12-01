'use strict';
module.exports = (sequelize, DataTypes) => {
  var controlValue = sequelize.define('controlValue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: { type: DataTypes.TEXT }
  });

  controlValue.associate = function(models) {
    models.control.belongsToMany(models.process, { through: controlValue });
    models.process.belongsToMany(models.control, { through: controlValue });
  };

  return controlValue;
};
