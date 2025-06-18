const { getOneUserById, updateOneUserById } = require('../services/user.service');

// ? TODO: сделать средствами sequelize - получить balance
const getBalance = async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await getOneUserById(userId);

		res.status(200).json({ balance: user?.balance });
	} catch (e) {
		// next(e); // TODO:
		res.status(500).json({ error: 'An error occurred while updating balance' });
	}
};

// ? TODO: сделать средствами sequelize - получить balance
const updateBalance = async (req, res) => {
	const { userId, amount } = req.body;

	if (typeof userId !== 'number' || typeof amount !== 'number') {
		return res.status(400).json({ error: 'Invalid input' });
	}

	try {
		const user = await getOneUserById(userId);
		if (!user) {
			return res.status(404).json({ error: `User with id ${userId} not found` });
		}

		const newBalance = user.balance + amount;

		if (newBalance < 0) {
			return res.status(400).json({ error: 'Insufficient funds' });
		}

		user.balance = newBalance;
		await user.save();

		res.status(200).json({ balance: user.balance });
	} catch (e) {
		// next(e); // TODO:
		res.status(500).json({ error: 'An error occurred while updating balance' });
	}
};

module.exports = {
	getBalance,
	updateBalance,
}
