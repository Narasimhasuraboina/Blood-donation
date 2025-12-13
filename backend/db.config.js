 // db.config.js - NO CHANGES NEEDED HERE, IT READS FROM .env
const mysql = require('mysql2');
require('dotenv').config(); // This line ensures it loads the .env file

const pool = mysql.createPool({
    host: process.env.DB_HOST,      // Reads from .env
    user: process.env.DB_USER,      // Reads from .env
    password: process.env.DB_PASSWORD,  // Reads from .env
    database: process.env.DB_NAME,  // Reads from .env
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();