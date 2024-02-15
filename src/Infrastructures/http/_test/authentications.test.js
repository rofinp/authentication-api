const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const dependencies = require('../../dependencies');
const createServer = require('../createServer');

describe('path: /authentications endpoint', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /authentications', () => {
    test('it should respond with a 400 status code when the login data does not contain the required property', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayamjago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };

      // create a new user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      const loginData = {
        username: 'ayamjago',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 400 status code when the login data has an invalid data type', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayamjago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };

      // create a new user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      const loginData = {
        username: {},
        password: 321,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 400 status code when the username is invalid or is not found', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayamjago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };

      // create a new user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      const loginData = {
        username: 'ayambakar',
        password: 'secretpassword',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 401 status code when the password is not match or is incorrect', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayamjago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };

      // create a new user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      const loginData = {
        username: 'ayamjago',
        password: 'password_ayam',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 401);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 201 status code and provide the new authentication details', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayamjago',
        password: 'secretpassword',
        fullname: 'John Doe',
      };

      /* create a new user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      const loginData = {
        username: 'ayamjago',
        password: 'secretpassword',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 201);
      expect(responseJson).toHaveProperty('status', 'success');
      expect(responseJson.data).toHaveProperty('accessToken');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data).toHaveProperty('refreshToken');
      expect(responseJson.data.refreshToken).toBeDefined();
    });
  });

  describe('PUT /authentications', () => {
    test('it should respond with a 400 status code when the data does not contain the required property', async () => {
      // Arrange
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 400 status code when the refresh token has invalid data type specifications', async () => {
      // Arrange
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken: 123 },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 400 status code when the refresh token is not registered in the database or is invalid', async () => {
      // Arrange
      const server = await createServer(dependencies);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken: 'invalid_token' },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
    });

    test('it should respond with a 200 status code and provide a new access token', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayambakar',
        password: 'daus_mini',
        fullname: 'Alfiansyah Komeng',
      };

      const loginData = {
        username: userData.username,
        password: userData.password,
      };

      /* create a new user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      /* create a new authentication & get the user refresh token */
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      const { refreshToken } = (JSON.parse(loginResponse.payload)).data;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
      expect(responseJson.data).toHaveProperty('accessToken');
      expect(responseJson.data.accessToken).toBeDefined();
    });
  });

  describe('DELETE /authentications', () => {
    // Arrange
    test('it should respond with a 400 status code when the refresh token is not registered in the database or is invalid', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayambakar',
        password: 'daus_mini',
        fullname: 'Alfiansyah Komeng',
      };

      const loginData = {
        username: userData.username,
        password: userData.password,
      };

      /* create a new user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      /* create a new authentication */
      await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken: 'refresh_token' },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.message).toBeDefined();
    });

    test('it should respond with a 400 status code when the data does not contain the required property', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayambakar',
        password: 'daus_mini',
        fullname: 'Alfiansyah Komeng',
      };

      const loginData = {
        username: userData.username,
        password: userData.password,
      };

      /* create a new user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      /* create a new authentication */
      await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.message).toBeDefined();
    });

    test('it should respond with a 400 status code when the refresh token has invalid data type specifications', async () => {
      // Arrange
      const server = await createServer(dependencies);

      const userData = {
        username: 'ayambakar',
        password: 'daus_mini',
        fullname: 'Alfiansyah Komeng',
      };

      const loginData = {
        username: userData.username,
        password: userData.password,
      };

      /* create a new user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      /* create a new authentication */
      await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken: 123 },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.message).toBeDefined();
    });

    test('it should respond with a 200 status code when the refresh token is valid', async () => {
      // Arrange
      const server = await createServer(dependencies);
      const userData = {
        username: 'ayambakar',
        password: 'daus_mini',
        fullname: 'Alfiansyah Komeng',
      };

      const loginData = {
        username: userData.username,
        password: userData.password,
      };

      /* create a new user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData,
      });

      /* create a new authentication & get the user refresh token */
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginData,
      });

      const { refreshToken } = (JSON.parse(loginResponse.payload)).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    });
  });
});
