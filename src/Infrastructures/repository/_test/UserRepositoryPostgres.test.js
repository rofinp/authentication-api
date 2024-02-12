const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const UserRepository = require('../../../Domains/users/UserRepository');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  test('it should be instance of the UserRepository domain class', async () => {
    const userRepositoryPostgres = new UserRepositoryPostgres({}, {});
    expect(userRepositoryPostgres).toBeInstanceOf(UserRepository);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUser function', () => {
    test('it should persist register user instance correctly', async () => {
      // Arrange
      const userData = new RegisterUser({
        username: 'ayamkalasan',
        password: 'secretpassword',
        fullname: 'John Doe',
      });

      const fakeIDGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIDGenerator);

      // Action
      await userRepositoryPostgres.addUser(userData);

      // Assert
      const getUser = await UsersTableTestHelper.findUserById('user-123');

      expect(userData).toBeInstanceOf(RegisterUser);
      expect(getUser).toHaveProperty('id', 'user-123');
      expect(getUser).toBeDefined();
    });

    test('it should return the registered user object correctly', async () => {
      // Arrange
      const userData = new RegisterUser({
        username: 'ayamkalasan',
        password: 'secretpassword',
        fullname: 'John Doe',
      });

      const fakeIDGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIDGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(userData);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'ayamkalasan',
        fullname: 'John Doe',
      }));
    });
  });

  describe('isUsernameAvailable function', () => {
    test('it should throw an InvariantError when the username is unavailable', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});

      // Action & Assert
      await expect(userRepositoryPostgres.isUsernameAvailable('ayamjago'))
        .rejects.toThrow(InvariantError);
    });

    test('it should not throw an InvariantError when the username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.isUsernameAvailable('ayambawang'))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername function', () => {
    test('it should throw an InvariantError if the username is not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getPasswordByUsername('ayamjago'))
        .rejects.toThrow(InvariantError);
    });

    test('it should not throw an InvariantError if the username is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'ayamjago',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('ayamjago');
      expect(password).toBe('secret_password');
    });
  });
});
