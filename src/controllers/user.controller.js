const { getOneUserById, updateOneUserById } = require('../services/user.service');
// const { isValidNumber } = require('../validators');
const { ERROR_MESSAGES } = require('../errors/messages.errors');

const getBalance = async (req, res) => {
	const { userId } = req.params;

	// if (!isValidNumber(userId)) {
	if (isNaN(userId)) {
		return res.status(400).json({ error: ERROR_MESSAGES.INVALID_PARAMETER('userId', userId) });
	}

	try {
		const user = await getOneUserById(userId);
		if (!user) {
			return res.status(404).json({ error: ERROR_MESSAGES.ENTITY_NOT_FOUND('user', userId) });
		}

		res.status(200).json({ balance: user?.balance });
	} catch (e) {
		// next(e); // TODO:
		res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER() });
	}
};

const updateBalance = async (req, res) => {
	// const userId = req.params.userId;
	// const amount = req.body.amount;
	const { userId } = req.params;
	const { amount } = req.body;

	// if (!isValidNumber(userId)) {
	if (isNaN(userId)) {
		return res.status(400).json({ error: ERROR_MESSAGES.INVALID_PARAMETER('userId', userId) });
	}

	if (typeof amount !== 'number') {
		return res.status(400).json({ error: ERROR_MESSAGES.INVALID_PARAMETER('amount', amount) });
	}

	try {
		const user = await getOneUserById(userId);
		if (!user) {
			return res.status(404).json({ error: ERROR_MESSAGES.ENTITY_NOT_FOUND('user', userId) });
		}

		const newBalance = user.balance + amount;

		if (newBalance < 0) {
			return res.status(400).json({ error: ERROR_MESSAGES.INVALID_BALANCE_VALUE() });
		}

		user.balance = newBalance;
		await user.save();

		res.status(200).json({ balance: user.balance });
	} catch (e) {
		// next(e); // TODO:
		res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER() });
	}
};

module.exports = {
	getBalance,
	updateBalance,
}
