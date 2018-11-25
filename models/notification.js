'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define('Notification', {
    text: { type: DataTypes.TEXT },
    details: { type: DataTypes.TEXT },
    entity: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    isNew: { type: DataTypes.ENUM('yes', 'no'), allowNull: false, defaultValue: 'yes' },
    addedOn: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.NOW }
  });

  Notification.associate = function(models) {
    models.Notification.belongsTo(models.User);
  };

  return Notification;
};
