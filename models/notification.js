'use strict';
module.exports = (sequelize, DataTypes) => {
  var notification = sequelize.define('notification', {
    text: { type: DataTypes.TEXT },
    details: { type: DataTypes.TEXT },
    entity: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    isNew: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    addedOn: { type: DataTypes.DATE, defaultValue: sequelize.NOW }
  });

  notification.associate = function(models) {
    models.notification.belongsTo(models.user);
  };

  return notification;
};
