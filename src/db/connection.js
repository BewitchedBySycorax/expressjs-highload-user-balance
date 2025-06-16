const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    // dialectOptions: {},
  }
);

module.exports = sequelize;


// const createDatabaseIfNotExists = async () => {
//   const client = new Client({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//   });

//   try {
//     await client.connect();
//     const dbName = process.env.DB_NAME;

//     const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
//     if (res.rowCount === 0) {
//       await client.query(`CREATE DATABASE "${dbName}"`);
//       console.log(`Database "${dbName}" created successfully.`);
//     } else {
//       console.log(`Database "${dbName}" already exists.`);
//     }
//   } catch (e) {
//     console.error('Error creating database:', e)
//     process.exit(1)
//   } finally {
//     await client.end();
//   }
// }

// module.exports = {
// 	createDatabaseIfNotExists,
// }
