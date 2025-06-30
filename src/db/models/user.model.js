// const { DataTypes } = require('sequelize'); // TODO: убрать это
const userSchema = require('../schemas/user.schema');

// const User = (sequelize) => sequelize.define('User', userSchema(DataTypes), {
const User = (sequelize) => sequelize.define('User', userSchema, {
  tableName: 'users',

  // Timestamps: https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
  // timestamps: true, // default
  // timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
