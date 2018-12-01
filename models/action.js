'use strict';
module.exports = (sequelize, DataTypes) => {
  var action = sequelize.define('action', {
    dateOpened: { type: DataTypes.DATE },
    dateClosed: { type: DataTypes.DATE },
    comment: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'completed/approved', 'rejected', 'revoked'),
      defaultValue: 'pending'
    }
  });

  action.associate = function(models) {
    models.action.belongsTo(models.process);
    models.action.belongsTo(models.user);
    models.action.belongsTo(models.template);
    models.action.belongsTo(models.step);
  };

  return action;
};
