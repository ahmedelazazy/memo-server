'use strict';
module.exports = (sequelize, DataTypes) => {
  var template = sequelize.define('template', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    hasForm: { type: DataTypes.BOOLEAN, defaultValue: 0 }
  });

  template.associate = function(models) {
    models.template.belongsTo(models.user);
    models.template.hasMany(models.step);
    models.template.hasMany(models.section);
    models.template.hasMany(models.control);
    models.template.hasMany(models.process);
    models.template.hasMany(models.action);
  };

  return template;
};
