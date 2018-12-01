'use strict';
module.exports = (sequelize, DataTypes) => {
  var task = sequelize.define('task', {
    dateOpened: { type: DataTypes.DATE },
    dateClosed: { type: DataTypes.DATE },
    comment: { type: DataTypes.TEXT },
    additionalInfo: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'completed/approved', 'rejected', 'revoked'),
      defaultValue: 'pending'
    },
    type: { type: DataTypes.ENUM('task', 'approval'), defaultValue: 'task' }
  });

  task.associate = function(models) {
    models.task.belongsTo(models.memo);
    models.task.belongsTo(models.user);
  };

  return task;
};
