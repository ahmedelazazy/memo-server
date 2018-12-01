'use strict';
module.exports = (sequelize, DataTypes) => {
  var process = sequelize.define('process', {
    dateOpened: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
    dateClosed: { type: DataTypes.DATE },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('started', 'completed/approved', 'rejected'),
      defaultValue: 'started'
    }
  });

  process.associate = function(models) {
    models.process.belongsTo(models.template);
    models.process.belongsTo(models.user);
    models.process.hasMany(models.action);
  };

  return process;
};
