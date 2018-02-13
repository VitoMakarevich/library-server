'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passportNumber: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'passport_number'
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
  return User;
};