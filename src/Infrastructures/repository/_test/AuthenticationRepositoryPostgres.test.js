const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres database connection', () => {
  test('it should be instance of AuthenticationRepository interface', async () => {
    const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres();
    expect(authenticationRepositoryPostgres).toBeInstanceOf(AuthenticationRepository);
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    test('it should adds a token to the database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'valid_token';

      // Action
      await authenticationRepositoryPostgres.addToken(token);

      // Assert
      const getToken = await AuthenticationsTableTestHelper.findToken(token);
      expect(getToken).toHaveProperty('token', token);
    });
  });

  describe('isTokenAvailable function', () => {
    test('it should throw an InvariantError if the token is not available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action & Assert
      await expect(authenticationRepositoryPostgres.isTokenAvailable('valid_token'))
        .rejects.toThrow(InvariantError);
    });

    test('it should not throw an InvariantError if the token is available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      await AuthenticationsTableTestHelper.addToken('valid_token');

      // Action & Assert
      await expect(authenticationRepositoryPostgres.isTokenAvailable('valid_token'))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    test('it should delete the token from the database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      await AuthenticationsTableTestHelper.addToken('valid_token');

      // Action
      await authenticationRepositoryPostgres.deleteToken('valid_token');

      // Assert
      const getToken = await AuthenticationsTableTestHelper.findToken('valid_token');
      expect(getToken).not.toBeDefined();
    });
  });
});
