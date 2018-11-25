'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  User.associate = function(models) {
    models.User.hasMany(models.Template);
    models.User.hasMany(models.Process);
    models.User.hasMany(models.Step);
    models.User.hasMany(models.Task);
    models.User.hasMany(models.Memo);
    models.User.hasMany(models.Action);
    models.User.hasMany(models.Notification);
  };

  return User;
};
