module.exports = {
  up: async ({ context: queryInterface }) => {
    const Sequelize = queryInterface.sequelize.constructor

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false,
      },
    })

    await queryInterface.bulkInsert('users', [{
      balance: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users')
  }
}

// TODO:
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('users', {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       balance: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 10000,
//       },
//       createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.fn('now'),
//       },
//       updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.fn('now'),
//       },
//     })

//     await queryInterface.bulkInsert('users', [{
//       balance: 10000,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }])
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('users')
//   },
// }