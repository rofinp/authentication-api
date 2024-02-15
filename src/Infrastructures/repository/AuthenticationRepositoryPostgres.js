const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async addToken(token) {
    await this.pool.query({
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    });
  }

  async isTokenAvailable(token) {
    const result = await this.pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });
    if (!result.rowCount) {
      throw new InvariantError('refresh token is not available');
    }
  }

  async deleteToken(token) {
    await this.pool.query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    });
  }
}

module.exports = AuthenticationRepositoryPostgres;
