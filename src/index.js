const app = require('./app');
const { dbConnect, dbRunMigrations } = require('./db/connection');

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
		const PORT = process.env.PORT || 3000;

		await dbConnect();
		await dbRunMigrations();

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
