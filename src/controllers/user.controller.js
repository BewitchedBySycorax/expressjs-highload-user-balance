const updateBalance = async (req, res) => {
	const { userId, amount } = req.body

	if (typeof userId !== 'number' || typeof amount !== 'number') {
		return res.status(400).json({ error: 'Invalid input' })
	}

	try {
		const user = await this.userModel.findByPk(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		const newBalance = user.balance + amount

		if (newBalance < 0) {
			return res.status(400).json({ error: 'Insufficient funds' })
		}

		user.balance = newBalance
		await user.save()

		res.status(200).json({ balance: user.balance })
	} catch (e) {
		res.status(500).json({ error: 'An error occurred while updating balance' })
	}
}

module.exports = {
	updateBalance
}
