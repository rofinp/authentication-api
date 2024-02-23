const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should respond with a 404 status code when an unregistered route is requested', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response).toHaveProperty('statusCode', 404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const userData = {
      username: 'ayamjago',
      fullname: 'John Doe',
      password: 'supersecret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userData,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response).toHaveProperty('statusCode', 500);
    expect(responseJson).toHaveProperty('status', 'error');
    expect(responseJson).toHaveProperty('message', 'terjadi kegagalan pada server kami');
  });
});

describe('when GET /', () => {
  test('it should return with a 200 status code and hello world', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response).toHaveProperty('statusCode', 200);
    expect(responseJson).toHaveProperty('value', 'Hello world!');
  });
});
