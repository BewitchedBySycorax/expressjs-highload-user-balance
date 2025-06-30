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

		//

		/**
		 * 2. Alternate version (sequelize raw query)
		 */
		// const [_, updatedUser] = await sequelize.query(
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

		// if (updatedUser?.rowCount === 0) {
		// 	// TODO: custom error
		// 	throw new Error('Not enough funds');
		// }

		//

		// DEBUG
		// console.log('user.service.js', 'updateUserBalance()', 'updatedUser', updatedUser);

    return updatedUser;
  } catch (e) {
    console.error('user.service.js', 'updateUserBalance()', 'e', e);
    throw e; // TODO: custom error
  }
};

module.exports = {
  getOneUserById,
  getUserBalance,
  updateUserBalance,
}
