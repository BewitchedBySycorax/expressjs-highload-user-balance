/**
 * https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton
 */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  // up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('users', {
      id: {
        // type: DataTypes.INTEGER,
        // type: Sequelize.DataTypes.INTEGER,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      balance: {
        // type: DataTypes.INTEGER,
        // type: Sequelize.DataTypes.INTEGER,
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10000,
      },
      createdAt: {
        // type: DataTypes.DATE,
        // type: Sequelize.DataTypes.DATE,
        type: Sequelize.DATE,
        allowNull: false,
        // defaultValue: DataTypes.NOW,
        // defaultValue: Sequelize.DataTypes.NOW,
        defaultValue: Sequelize.NOW,
        // defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        // type: DataTypes.DATE,
        // type: Sequelize.DataTypes.DATE,
        type: Sequelize.DATE,
        allowNull: false,
        // defaultValue: DataTypes.NOW,
        // defaultValue: Sequelize.DataTypes.NOW,
        defaultValue: Sequelize.NOW,
        // defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.bulkInsert('users', [{
      balance: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  // async down (queryInterface, _Sequelize) {
  down: async (queryInterface, _Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('users');
  }
};
