'use strict';
module.exports = (sequelize, DataTypes) => {
  var step = sequelize.define('step', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    type: { type: DataTypes.ENUM('task', 'approval'), defaultValue: 'task' },
    order: DataTypes.INTEGER,
    stepUiId: DataTypes.STRING
  });

  step.associate = function(models) {
    models.step.belongsTo(models.user);
    models.step.belongsTo(models.template);
    models.step.hasMany(models.action);
  };

  return step;
};
