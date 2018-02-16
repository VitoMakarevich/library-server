const { Pool } = require('pg');
const fs = require('fs');
const file = fs.readFileSync(__dirname + '/migrate.json',{encoding: 'utf-8'});
const config = JSON.parse(file)[process.env.NODE_ENV];


const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: 5432,
});

module.exports = { pool }