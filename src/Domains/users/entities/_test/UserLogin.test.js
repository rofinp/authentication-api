const UserLogin = require('../UserLogin');

describe('UserLogin entity', () => {
  test('it should throw an error if the user login data does not contain the required property', () => {
    // Arrange
    const loginData = {
      username: 'ayamjago',
    };

    // Action & Assert
    expect(() => new UserLogin(loginData))
      .toThrow('USER_LOGIN.MISSING_REQUIRED_PROPERTY');
  });

  test('it should throw an error if the user login data does not meet the data type specifications', () => {
    // Arrange
    const loginData = {
      username: {},
      password: 321,
    };

    // Action & Assert
    expect(() => new UserLogin(loginData))
      .toThrow('USER_LOGIN.INVALID_DATA_TYPE');
  });
});
