'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  user.associate = function(models) {
    models.user.hasMany(models.template);
    models.user.hasMany(models.process);
    models.user.hasMany(models.step);
    models.user.hasMany(models.task);
    models.user.hasMany(models.memo);
    models.user.hasMany(models.action);
    models.user.hasMany(models.notification);
  };

  return user;
};
