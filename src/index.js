const sequelize = require('./db/connection');
const app = require('./app');

if (process.env.NODE_ENV !== 'production') {
	process.on('unhandledRejection', (reason, _promise) => {
		console.error('Unhandled Rejection:', reason);
	});

	process.on('uncaughtException', (e) => {
		console.error('Uncaught Exception:', e);
	});
}


;(async () => {
  try {
    await sequelize.sync({ logging: false });

    try {
      await sequelize.authenticate({ logging: false });
      console.log('Connection to the database has been established successfully.');
    } catch (e) {
      console.error('Unable to connect to the database:', e);
    }

    // ?? TODO:
    // await runMigrations()

    // console.log('Migrations run successfully')
    // console.log('Database created.')
    // ?? TODO:

		const PORT = process.env.PORT || 3000;

		// await createDatabaseIfNotExists();
		
		// const testConnection = async () => {
		// 	try {
		// 		await sequelize.authenticate();
		// 		console.log('Connection has been established successfully.');
		// 	} catch (e) {
		// 		console.error('Unable to connect to the database:', e);
		// 	}
		// }
		
		// await runMigrations();

		app.listen(
			PORT,
			process.env.NODE_ENV !== 'production' ? '0.0.0.0' : '127.0.0.1',
			() => console.log(`Server started on port ${PORT}`),
		)
  } catch (e) {
		console.error(e);
		process.exit(1);
  }
})();
