/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  addUser: async ({
    id = 'user-123',
    username = 'ayamjago',
    password = 'secretpassword',
    fullname = 'John Doe',
  }) => {
    await pool.query({
      text: `INSERT INTO users (id, username, password, fullname)
             VALUES ($1, $2, $3, $4)`,
      values: [id, username, password, fullname],
    });
  },

  findUserById: async (id) => {
    const result = await pool.query({
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    });
    return result.rows[0];
  },

  cleanTable: async () => {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
