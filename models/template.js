'use strict';
module.exports = (sequelize, DataTypes) => {
  var Template = sequelize.define('Template', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    hasForm: { type: DataTypes.ENUM('yes', 'no'), allowNull: false, defaultValue: 'no' }
  });

  Template.associate = function(models) {
    models.Template.belongsTo(models.User);
    models.Template.hasMany(models.Step);
    models.Template.hasMany(models.Section);
    models.Template.hasMany(models.Process);
    models.Template.hasMany(models.Action);
  };

  return Template;
};
