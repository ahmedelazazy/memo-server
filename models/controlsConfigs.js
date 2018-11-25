'use strict';
module.exports = (sequelize, DataTypes) => {
  var ControlsConfig = sequelize.define('ControlsConfig', {
    visibility: { type: DataTypes.ENUM('hidden', 'readonly', 'editable', 'required') },
    config: { type: DataTypes.TEXT }
  });

  ControlsConfig.associate = function(models) {
    // models.Control.belongsToMany(models.Step, { through: models.ControlsConfig });
    // models.Step.belongsToMany(models.Control, { through: models.ControlsConfig });
    // models.ControlsConfig.belongsTo(models.Template);
  };

  return ControlsConfig;
};
