const { DataTypes } = require('sequelize')
const sequelize = require('../connection')

const User = sequelize.define('User', {
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10000,
  },
}, {
  tableName: 'users',
  timestamps: false,
})

module.exports = User
