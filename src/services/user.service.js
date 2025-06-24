const { Sequelize } = require('sequelize');

// TODO: убрать это
// const { sequelize } = require('../utils/umzug');
// const { sequelize } = require('../db/connection');
// const { sequelize } = require('../db/models');
// TODO: убрать это

const { User } = require('../db/models');

const getOneUserById = async (userId) => {
  try {
		const user = await User.findByPk(userId);
		console.log(9, user);
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
// ! TODO: 2. Нормально разобраться с решениями ниже и с параллелизмом

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

		/**
		 * 1. Primary version (sequelize query)
		 */
		// const [updatedRows] = await User.update(
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

		// console.log(70, updatedUser);

    return updatedUser;
    // return await getUserBalance(userId); // TODO:

		//

		// TODO:
		/**
		 * 2. Alternate version (sequelize raw query)
		 */
		// await sequelize.query(
		// 	`
		// 		UPDATE users
		// 		SET balance = balance + :amount
		// 		WHERE id = :userId
		// 		${amount < 0 ? 'AND balance >= :checkAmount' : ''}
		// 	`,
		// 	{
		// 		replacements: {
		// 			amount,
		// 			userId,
		// 			checkAmount: -amount
		// 		}
		// 	}
		// );

		// TODO:
		/**
		 * 3. Another alternate version (sequelize transaction)
		 */
		// await sequelize.transaction(async (t) => {
		// 	const [count] = await User.update(
		// 		{ balance: Sequelize.literal(`balance - ${amount}`) },
		// 		{
		// 			where: { id: fromUserId, balance: { [Op.gte]: amount } },
		// 			transaction: t
		// 		}
		// 	);

		// 	if (count === 0) {
		// 		return res.status(400).json({ error: ERROR_MESSAGES.INVALID_BALANCE_VALUE() });
		// 		// TODO: errors
		// 		// throw new Error('Not enough funds');
		// 	}

		// 	await User.update(
		// 		{ balance: Sequelize.literal(`balance + ${amount}`) },
		// 		{
		// 			where: { id: userId },
		// 			transaction: t
		// 		}
		// 	);
		// });
  } catch (e) {
    console.error('user.service.js', 'updateUserBalance()', 'e', e);
    throw e; // TODO: custom error
  }
};

;(async () => {
	try {
		// const { balance } = await getUserBalance(1);
		// await updateUserBalance(1, 10000 - balance);
		// await updateUserBalance(1, 10 - balance); // ! DEBUG
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
