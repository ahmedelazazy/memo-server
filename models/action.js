'use strict';
module.exports = (sequelize, DataTypes) => {
  var Action = sequelize.define('Action', {
    dateOpened: { type: DataTypes.DATE },
    dateClosed: { type: DataTypes.DATE },
    comment: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'completed/approved', 'rejected', 'revoked'),
      defaultValue: 'pending'
    }
  });

  Action.associate = function(models) {
    models.Action.belongsTo(models.Process);
    models.Action.belongsTo(models.User);
    models.Action.belongsTo(models.Template);
    models.Action.belongsTo(models.Step);
  };

  return Action;
};
