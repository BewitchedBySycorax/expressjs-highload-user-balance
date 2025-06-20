const userService = require('../services/user.service');
// const { isValidNumber } = require('../validators');
const { ERROR_MESSAGES } = require('../errors/messages.errors');

const getBalance = async (req, res) => {
	const { userId } = req.params;

	// if (!isValidNumber(userId)) {
	if (isNaN(userId)) {
		return res.status(400).json({ error: ERROR_MESSAGES.INVALID_PARAMETER('userId', userId) });
	}

	try {
		const user = await userService.getOneUserById(userId);

		if (!user) {
			return res.status(404).json({ error: ERROR_MESSAGES.ENTITY_NOT_FOUND('user', userId) });
		}

		res.status(200).json({ balance: user.balance });
	} catch (e) {
		// next(e); // TODO:
		res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER() });
	}
};

const _getBalance = async (req, res) => {
	const { userId } = req.params;

	// if (!isValidNumber(userId)) {
	if (isNaN(userId)) {
		return res.status(400).json({ error: ERROR_MESSAGES.INVALID_PARAMETER('userId', userId) });
	}

	try {
		const balance = (await userService.getUserBalance(userId))?.balance;
		if (!balance) {
			return res.status(404).json({ error: ERROR_MESSAGES.ENTITY_NOT_FOUND('user', userId) });
		}

		res.status(200).json({ balance });
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
		await userService.updateUserBalance(userId, amount);

		// console.log(66, updatedUser);

		// res.status(200).json({ balance: updatedUser.balance });
		res.status(200).json({ balance: 0 });
	} catch (e) {
		// next(e); // TODO:

		// TODO: custom errors
		if (e.message?.includes('funds')) {
			res.status(409).json({ error: ERROR_MESSAGES.INVALID_BALANCE_VALUE() });
		} else {
			console.error('user.controller.js', 'updateBalance()', 'e.message', e.message);
			res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER() });
		}
	}
};

module.exports = {
	getBalance,
	updateBalance,
}
