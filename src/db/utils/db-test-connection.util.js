const dbTestConnection = async (sequelize) => {
  try {
    // await sequelize.authenticate({ logging: false });
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }
};

module.exports = {
  dbTestConnection,
};
