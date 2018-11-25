'use strict';
module.exports = (sequelize, DataTypes) => {
  var Step = sequelize.define('Step', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    type: { type: DataTypes.ENUM('task', 'approval'), allowNull: false, defaultValue: 'task' },
    order: DataTypes.INTEGER
  });

  Step.associate = function(models) {
    models.Step.belongsTo(models.User);
    models.Step.belongsTo(models.Template);
    models.Step.hasMany(models.Action);
  };

  return Step;
};
