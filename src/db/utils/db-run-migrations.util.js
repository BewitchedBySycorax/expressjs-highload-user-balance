// const { sequelize } = require('./models'); // ! Do not use this as it may cause conflict in case there are no models yet but migrations run
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    // dialectOptions: {},
    logging: false
  },
);

const dbRunMigrations = async () => {
  /**
   * https://github.com/sequelize/umzug
   */
  const umzug = new Umzug({
    migrations: {
      glob: 'src/db/migrations/*.js',
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    /**
     * NOTE: logger in new Sequelize() from above has more priority
     */
    // logger: console,
    // logger: undefined,
    // logger: false,
  })

  try {
    await umzug.up();
    console.log('Migrations completed.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports = {
  dbRunMigrations,
};
