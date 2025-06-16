# node.js-highload-app-1 documentation

## Overview
This project is a simple web application built using Node.js and Express. It provides functionality to manage user balances stored in a PostgreSQL database using Sequelize ORM. The application supports real-time updates to user balances while ensuring that the balance does not fall below zero.

## Project Structure
```
node.js-highload-app-1
├── src
│   ├── index.js                # Entry point of the application
│   ├── app.js                  # Core of application
│   ├── routes
│   │   └── userRoutes.js       # User-related routes
│   ├── controllers
│   │   └── userController.js    # Logic for handling user balance updates
│   ├── models
│   │   └── user.js              # User model definition
│   ├── migrations
│   │   └── create-users-table.js # Migration script for creating users table
│   └── config
│       └── database.js          # Database configuration
├── package.json                 # NPM configuration file
├── .sequelizerc                 # Sequelize configuration file
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd node.js-highload-app-1
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure the database access parameters**
   Update the `src/db/config.json` file with your PostgreSQL database credentials.

4. **Create new database**
   Run the following command in terminal window:
   ```
   npm run dev:db:create
   ```

5. **Run migrations**
   To create the `users` table in the database, run:

   !!! TODO: npm run instead of npx sequelize-cli... !!!

   ```
   npx sequelize-cli db:migrate
   ```

6. **Start the application**
   ```
   npm start
   ```

## Usage
- The application exposes an endpoint to update a user's balance:
  ```
  POST /api/users/update-balance
  ```
  - **Parameters:**
    - `userId`: The ID of the user whose balance is to be updated.
    - `amount`: The amount to adjust the balance (can be positive or negative).

## Testing
The application has been designed to handle concurrent requests efficiently. It has been tested to ensure that it can handle 10,000 simultaneous requests to withdraw 2 units from a user's balance, with at least 5,000 requests succeeding while the rest receive an appropriate error message for insufficient funds.

## License
This project is licensed under the MIT License.