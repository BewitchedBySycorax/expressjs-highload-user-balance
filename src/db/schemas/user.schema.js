// target: Sequelize || DataTypes
module.exports = (target) => ({
  id: {
    // type: Sequelize.INTEGER,
    // type: DataTypes.INTEGER,
    type: target.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  balance: {
    // type: Sequelize.INTEGER,
    // type: DataTypes.INTEGER,
    type: target.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    // type: Sequelize.DATE,
    // defaultValue: Sequelize.fn('NOW'),
    // type: DataTypes.DATE,
    // defaultValue: DataTypes.NOW,
    type: target.DATE,
    defaultValue: target.NOW,
    allowNull: false,
  },
  updated_at: {
    // type: Sequelize.DATE,
    // defaultValue: Sequelize.fn('NOW'),
    // type: DataTypes.DATE,
    // defaultValue: DataTypes.NOW,
    type: target.DATE,
    defaultValue: target.NOW,
    allowNull: false,
  },
});
