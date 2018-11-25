'use strict';
module.exports = (sequelize, DataTypes) => {
  var Memo = sequelize.define('Memo', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    dateOpened: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.NOW },
    dateClosed: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM('started', 'completed/approved', 'rejected'),
      allowNull: false,
      defaultValue: 'started'
    }
  });

  Memo.associate = function(models) {
    models.Memo.belongsTo(models.User);
    models.Memo.hasMany(models.Task);
  };

  return Memo;
};
