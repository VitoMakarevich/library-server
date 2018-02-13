'use strict';
const Author = require('./index').Author;

module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    author: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Author,
        key: 'id'
      }
    },
    usesCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'uses_count'
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
  return Book;
};