const { DataTypes } = require('sequelize');
// const { sequelize } = require('../connection');

// TODO:
module.exports = (sequelize) => {
  return sequelize.define('User', {
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10000,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });
};

// TODO:
// const User = sequelize.define('User', {
//   balance: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 10000,
//   },
// }, {
//   tableName: 'users',
//   timestamps: false,
// })

// module.exports = User;
