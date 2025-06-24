const { sequelize } = require('../models');
const { dbRunMigrations } = require('./db-run-migrations.util');
const { dbTestConnection } = require('./db-test-connection.util');

// Sequelize model synchronization: https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
const dbInit = async () => {
	const mode = process.env.DB_SYNC_MODE;

	switch (mode) {
		case 'force':
			console.warn('⚠️ Running sequelize.sync({ force: true })...');
			await sequelize.sync({ force: true });
			break;

		case 'safe':
			console.log('🔄 Running sequelize.sync()...');
			await sequelize.sync();
			break;

		default:
			console.log('📦 Running migrations...');
			await dbRunMigrations();
			break;
	}

  console.log('Database has been synchronized successfully.');
	await dbTestConnection(sequelize);
}

module.exports = {
  dbInit,
};
