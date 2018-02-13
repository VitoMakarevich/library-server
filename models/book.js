'use strict';

module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('book', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
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
    },
  }, {
      timestamps: false,
      underscored: true
  });

  Book.author = Book.belongsTo(sequelize.models.author, {as: 'author'});

  return Book;
};