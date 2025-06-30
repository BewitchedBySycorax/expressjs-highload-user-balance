const app = require('./app');
const { dbInit } = require('./db/utils');

// DEBUG
// const { User } = require('./db/models');
const { getUserBalance, updateUserBalance } = require('./services/user.service');
// DEBUG

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

		// DEBUG
		// await User.create({ balance: 15000 });
		// await User.update({ balance: 49000 }, { where: { id: 1 }});
		// await User.update({ balance: 37000 }, { where: { id: 3 }});
		//
		const { balance } = await getUserBalance(1);
		await updateUserBalance(1, 10000 - balance);
		// await updateUserBalance(1, 10 - balance); // DEBUG
		// DEBUG

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
