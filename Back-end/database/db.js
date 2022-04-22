'use strict';
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    // database works in local host
    host: process.env.DB_HOST="127.0.0.1",
    user: process.env.DB_USER="root",
    password: process.env.DB_PASS="kissa",
    database: process.env.DB_NAME="foodbase",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;