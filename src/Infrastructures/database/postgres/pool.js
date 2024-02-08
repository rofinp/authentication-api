/* istanbul ignore file */
const { Pool } = require('pg');

const poolConfig = {
  test: {
    connectionString: process.env.DATABASE_URL_TEST,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

const environment = poolConfig[process.env.NODE_ENV || 'production'];
const pool = new Pool(environment);

module.exports = pool;
