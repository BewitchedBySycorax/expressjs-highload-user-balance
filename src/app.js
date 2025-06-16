const express = require('express');

const userRoutes = require('./routes/user.routes');

const app = express();

app.sequelize = 

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/users', userRoutes);

module.exports = app;
