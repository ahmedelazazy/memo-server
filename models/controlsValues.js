'use strict';
module.exports = (sequelize, DataTypes) => {
  var ControlValues = sequelize.define('ControlValues', {
    ControlValues: { type: DataTypes.TEXT }
  });

  ControlValues.associate = function(models) {
    // models.Control.belongsToMany(models.Process, { through: ControlValues });
    // models.Process.belongsToMany(models.Control, { through: ControlValues });
  };

  return ControlValues;
};
