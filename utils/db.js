const { pool } = require('../config/db.config');

var connect = async () => await pool.connect();

var close = (dbClient) => dbClient.release();

module.exports = { connect, close };