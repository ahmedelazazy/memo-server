'use strict';
module.exports = (sequelize, DataTypes) => {
  var Process = sequelize.define('Process', {
    dateOpened: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.NOW },
    dateClosed: { type: DataTypes.DATE },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('started', 'completed/approved', 'rejected'),
      allowNull: false,
      defaultValue: 'started'
    }
  });

  Process.associate = function(models) {
    models.Process.belongsTo(models.Template);
    models.Process.belongsTo(models.User);
    models.Process.hasMany(models.Action);
  };

  return Process;
};
