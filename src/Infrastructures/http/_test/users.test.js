const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const dependencies = require('../../dependencies');
const createServer = require('../createServer');

describe('path: /users endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /users', () => {
    test('it should responds with a 201 status code and created user', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayamjago',
        password: 'supersecret',
        fullname: 'John Doe',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 201);
      expect(responseJson).toHaveProperty('status', 'success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    test('it should respond with a 400 status code when the user data payload does not contain required property', async () => {
      // Arrange
      const userData = {
        fullname: 'John Doe',
        password: 'secretpassword',
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    test('it should respond with a 400 status code when the user data payload does not meet data type specifications', async () => {
      // Arrange
      const userData = {
        username: 123,
        password: 'secretpassword',
        fullname: ['John Doe'],
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    test('it should respond with a 400 status code when the username exceeds 50 characters', async () => {
      // Arrange
      const userData = {
        username: 'ayamjagoayamjagoayamjagoayamjagoayamjagoayamjagoayamjagoayamjago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    test('it should throw an error if the username is fewer than 6 characters', async () => {
      // Arrange
      const userData = {
        username: 'ayam',
        password: 'secretpassword',
        fullname: 'John Doe',
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    test('it should respond with a 400 status code when the username contains a restricted character', async () => {
      // Arrange
      const userData = {
        username: 'ayam jago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    test('should respond with a 400 status code when the username is unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'ayamjago' });
      const userData = {
        username: 'ayamjago',
        fullname: 'John Doe',
        password: 'secretpassword',
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'username is not available');
    });

    test('it should throw an error if the password is fewer than 8 characters', async () => {
      // Arrange
      const userData = {
        username: 'ayamjago',
        fullname: 'John Doe',
        password: 'secret',
      };
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message', 'tidak dapat membuat user baru karena password kurang dari delapan karakter');
    });
  });
});
