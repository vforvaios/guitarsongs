// const mysql = require('mysql2/promise');
// const config = require('../config');

// module.exports = mysql.createPool(config.db);

const { Pool } = require("pg");
const config = require("../config");

const pool = new Pool(config.db);

module.exports = pool;
