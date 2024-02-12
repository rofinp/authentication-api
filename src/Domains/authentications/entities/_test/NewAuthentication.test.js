const NewAuthentication = require('../NewAuthentication');

describe('NewAuthentication entity', () => {
  test('it should throw an error if the authentication data does not contain required property', () => {
    // Arrange
    const authData = {
      accessToken: 'access_token',
    };

    // Action & Assert
    expect(() => new NewAuthentication(authData)).toThrow('NEW_AUTHENTICATION.MISSING_REQUIRED_PROPERTY');
  });

  test('it should throw an error if the authentication data does not meet the data type specification', () => {
    // Arrange
    const authData = {
      accessToken: true,
      refreshToken: 123,
    };

    // Action & Assert
    expect(() => new NewAuthentication(authData)).toThrow('NEW_AUTHENTICATION.INVALID_DATA_TYPE');
  });

  test('it should create NewAuthentication object correctly', () => {
    // Arrange
    const authenticationData = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    // Action
    const newAuthentication = new NewAuthentication(authenticationData);

    // Assert
    expect(newAuthentication).toBeInstanceOf(NewAuthentication);
    expect(newAuthentication).toHaveProperty('accessToken', authenticationData.accessToken);
    expect(newAuthentication).toHaveProperty('refreshToken', authenticationData.refreshToken);
  });
});
