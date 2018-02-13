'use strict';
module.exports = (sequelize, DataTypes) => {
  var Author = sequelize.define('author', {
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    }
  }, {
      timestamps: false,
      underscored: true
  });
  return Author;
};