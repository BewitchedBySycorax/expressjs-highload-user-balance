const userSchema = require('../schemas/user.schema');

module.exports = {
  up: async ({ context: queryInterface }) => {
    const Sequelize = queryInterface.sequelize.constructor;

    await queryInterface.createTable('users', userSchema(Sequelize));
    await queryInterface.bulkInsert('users', [{
      balance: 10000,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users');
  },
}
