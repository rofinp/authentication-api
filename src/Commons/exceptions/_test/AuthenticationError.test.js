const AuthenticationError = require('../AuthenticationError');
const ClientError = require('../ClientError');

describe('AuthenticationError', () => {
  test('it should create an AuthenticationError instance correctly', () => {
    const authenticationError = new AuthenticationError('authentication error!');

    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError).toHaveProperty('statusCode', 401);
    expect(authenticationError).toHaveProperty('message', 'authentication error!');
    expect(authenticationError).toHaveProperty('name', 'AuthenticationError');
  });
});
