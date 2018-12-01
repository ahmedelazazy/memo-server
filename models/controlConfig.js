'use strict';
module.exports = (sequelize, DataTypes) => {
  var controlConfig = sequelize.define('controlConfig', {
    visibility: {
      type: DataTypes.ENUM('hidden', 'readonly', 'editable', 'required'),
      allowNull: false
    },
    config: { type: DataTypes.TEXT }
  });

  controlConfig.associate = function(models) {
    models.controlConfig.belongsTo(models.template);
    models.control.belongsToMany(models.step, {
      through: models.controlConfig
    });
    models.step.belongsToMany(models.control, {
      through: models.controlConfig
    });
  };

  return controlConfig;
};
