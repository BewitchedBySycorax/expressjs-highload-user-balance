const { Sequelize } = require('sequelize');
// const { sequelize } = require('../utils/umzug');
const { sequelize } = require('../db/connection');
const { User } = require('../db/models');

const getOneUserById = async (userId) => {
  try {
    return await User.findByPk(userId);
  } catch (e) {
    // console.error(e);
    throw e; // TODO: custom error
  }
};

const getUserBalance = async (userId) => {
  try {
    return await User.findByPk(userId, { attributes: ['balance'] });
  } catch (e) {
    // console.error(e);
    throw e; // TODO: custom error
  }
};

// TODO: 1. дать адекватную ошибку rest api на запросы 5000 после того как баланс равен 0 (может уже есть - надо отключить сначала логгер)

const updateUserBalance = async (userId, amount) => {
  try {
		/**
		 * UPDATE users
		 * SET balance = balance + :amount
		 * WHERE id = :userId
		 * 		AND (balance >= ABS(:amount))
		 * --
		 * WHERE id = :userId AND balance + :amount >= 0
		 * RETURNING id, balance
		 */

    const [count, [updatedUser]] = await User.update(
			{
        balance: Sequelize.literal(`balance + ${amount}`), // Insert raw subquery —— SET balance = balance + <value>
      },
			{
				where: {
					id: userId,
          // ...(amount < 0 ? { balance: { [Sequelize.Op.gte]: -amount } } : {})
					...(amount < 0 ? { balance: { [Sequelize.Op.gte]: Math.abs(amount) } } : {})
          /**
           * where: {
           *    id: 42,
           *    balance: { [Op.gte]: 100 }
           * }
           *
           * SQL -- WHERE id = 42 AND balance >= 100
           */
				},
				returning: true,  // returning: true → PostgreSQL returns updated row
				plain: false      // plain: true → will return one row (not an entire array)
			}
		);

		if (count === 0) {
			// TODO: custom error
			throw new Error('Not enough funds');
		}

		return updatedUser;
  } catch (e) {
    console.error('user.service.js', 'updateUserBalance()', 'e', e);
    throw e; // TODO: custom error
  }
};

;(async () => {
	try {
		const { balance } = await getUserBalance(1);
		await updateUserBalance(1, 10000 - balance);
	} catch (e) {
		console.error(e);
    throw e; // TODO: custom error
	}
})();

module.exports = {
  getOneUserById,
  getUserBalance,
  updateUserBalance,
}
