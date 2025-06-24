const app = require('./app');
// const { User } = require('./db/models'); // ! DEBUG
const { dbInit } = require('./db/utils');

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

		await dbInit();

		// ! DEBUG
		// await User.create({ balance: 15000 });
		// await User.update({ balance: 15000 }, { where: { id: 1 }});
		// ! DEBUG

		const PORT = process.env.PORT || 3000;

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
