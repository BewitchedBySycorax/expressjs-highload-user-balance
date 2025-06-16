const { Umzug, SequelizeStorage } = require('umzug')
const sequelize = require('../db/config')

const umzug = new Umzug({
  migrations: {
    glob: 'src/db/migrations/*.js',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

async function runMigrations() {
  try {
    await umzug.up()
    console.log('Migrations completed.')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = {
  runMigrations
}
