const { Sequelize } = require('sequelize');
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

// TODO: 1. убрать логирование Executing (default): SELECT "id", "balance" FROM "users" AS "User" WHERE "User"."id" = '1';
// TODO: 2. дать адекватную ошибку rest api на запросы 5000 после того как баланс равен 0 (может уже есть - надо отключить сначала логгер)

const updateUserBalance = async (userId, amount) => {
  try {
		/**
		 * UPDATE users
		 * SET balance = balance + :amount
		 * WHERE id = :userId
		 * 	AND (balance >= ABS(:amount))
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

    // console.log(45, count, updatedUser);

		if (count === 0) {
      // TODO:
			// return res.status(400).json({ error: ERROR_MESSAGES.INVALID_BALANCE_VALUE() });
			// TODO: errors
			throw new Error('Not enough funds');
		}

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
    console.error(e);
    throw e; // TODO: custom error
  }
};

module.exports = {
  getOneUserById,
  getUserBalance,
  updateUserBalance,
}
