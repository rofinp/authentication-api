const UserRepository = require('../../Domains/users/UserRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addUser(userData) {
    const { username, password, fullname } = userData;
    const id = `user-${this.idGenerator()}`;
    const result = await this.pool.query({
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    });
    return new RegisteredUser({ ...result.rows[0] });
  }

  async isUsernameAvailable(username) {
    const result = await this.pool.query({
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    });
    if (result.rowCount) {
      throw new InvariantError('username is not available');
    }
  }

  async getPasswordByUsername(username) {
    const result = await this.pool.query({
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    });
    if (!result.rowCount) {
      throw new InvariantError('username is not found');
    }
    const { password } = result.rows[0];
    return password;
  }
}

module.exports = UserRepositoryPostgres;
