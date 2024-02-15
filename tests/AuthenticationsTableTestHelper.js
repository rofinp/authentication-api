const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  addToken: async (token) => {
    await pool.query({
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    });
  },
  findToken: async (token) => {
    const result = await pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });
    return result.rows[0];
  },
  cleanTable: async () => {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

module.exports = AuthenticationsTableTestHelper;
