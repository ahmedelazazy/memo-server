'use strict';
module.exports = (sequelize, DataTypes) => {
  var memo = sequelize.define('memo', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    dateOpened: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
    dateClosed: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM('started', 'completed/approved', 'rejected'),
      allowNull: false,
      defaultValue: 'started'
    }
  });

  memo.associate = function(models) {
    models.memo.belongsTo(models.user);
    models.memo.hasMany(models.task);
  };

  return memo;
};
