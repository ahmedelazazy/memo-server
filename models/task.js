'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    dateOpened: { type: DataTypes.DATE },
    dateClosed: { type: DataTypes.DATE },
    comment: { type: DataTypes.TEXT },
    addionalInfo: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'completed/approved', 'rejected', 'revoked'),
      defaultValue: 'pending'
    }
  });

  Task.associate = function(models) {
    models.Task.belongsTo(models.Memo);
    models.Task.belongsTo(models.User);
  };

  return Task;
};
