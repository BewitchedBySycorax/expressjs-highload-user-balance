const { Sequelize } = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
    allowNull: false,
  },
  updated_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
    allowNull: false,
  },
}

/**
 * NOTE:
 *    The code below doesn't work as expected due to the DataTypes peculiarities.
 *    In a nutshell: DataTypes doesn't provide oportunity of dynamic changing values when using RAW SQL or deal with DB UI 
 *    For further read: https://sequelize.org/docs/v7/models/data-types/#built-in-default-values-for-dates
 */

// target: Sequelize || DataTypes
// module.exports = (target) => {
//   // DEBUG
//   // console.log('user.schema.js', 'target', target);
//   // console.log('user.schema.js', 'target.fn?.(\'NOW\')', target.fn?.('NOW'));
//   // console.log('user.schema.js', 'target.NOW', target.NOW);
//   // console.log('user.schema.js', 'target.fn?.(\'NOW\') || target.NOW', target.fn?.('NOW') || target.NOW);
//   // DEBUG

//   return {
//     id: {
//       type: Sequelize.INTEGER,
//       // type: DataTypes.INTEGER,
//       // type: target.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     balance: {
//       type: Sequelize.INTEGER,
//       // type: DataTypes.INTEGER,
//       // type: target.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//     },
//     created_at: {
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.fn('NOW'),
//       // type: DataTypes.DATE,
//       // defaultValue: DataTypes.NOW, // Dynamic JS default values: https://sequelize.org/docs/v7/models/data-types/#built-in-default-values-for-dates
//       // type: target.DATE,
//       // defaultValue: target.fn?.('NOW') || target.NOW,
//       // defaultValue: Sequelize.fn('NOW'),
//       allowNull: false,
//     },
//     updated_at: {
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.fn('NOW'),
//       // type: DataTypes.DATE,
//       // defaultValue: DataTypes.NOW, // Dynamic JS default values: https://sequelize.org/docs/v7/models/data-types/#built-in-default-values-for-dates
//       // type: target.DATE,
//       // defaultValue: target.fn?.('NOW') || target.NOW,
//       // defaultValue: Sequelize.fn('NOW'),
//       allowNull: false,
//     },
//   }
// };
