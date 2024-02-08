const RegisterUser = require('../RegisterUser');

describe('RegisterUser entity', () => {
  it('should throw an error if the user data does not contain the required property', () => {
    // Arrange
    const userData = {
      username: 'ayamjago',
      fullname: 'John Doe',
    };

    // Action & Assert
    expect(() => new RegisterUser(userData))
      .toThrow('REGISTER_USER.MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error if the user data does not meet the data type specifications', () => {
    // Arrange
    const userData = {
      username: true,
      password: ['password'],
      fullname: {},
    };

    // Action & Assert
    expect(() => new RegisterUser(userData))
      .toThrow('REGISTER_USER.INVALID_DATA_TYPE');
  });

  it('should throw an error if the username exeeds 50 characters', () => {
    // Arrange
    const userData = {
      username: 'ayamjagoayamjagoayamjagoayamjagoayamjagoayamjagoayamjago',
      password: 'secretpassword',
      fullname: 'John Doe',
    };

    // Action & Assert
    expect(() => new RegisterUser(userData))
      .toThrow('REGISTER_USER.INVALID_USERNAME_LENGTH');
  });

  it('should throw an error if the username is fewer than 6 characters', () => {
    // Arrange
    const userData = {
      username: 'abc',
      password: 'secretpassword',
      fullname: 'John Doe',
    };

    // Action & Assert
    expect(() => new RegisterUser(userData))
      .toThrow('REGISTER_USER.INVALID_USERNAME_LENGTH');
  });

  it('should throw an error if the username contains a restricted character', () => {
    // Arrange
    const userData = {
      username: 'ayam jago',
      password: 'secretpassword',
      fullname: 'John Doe',
    };

    // Action & Assert
    expect(() => new RegisterUser(userData))
      .toThrow('REGISTER_USER.INVALID_USERNAME_FORMAT');
  });

  it('should throw an error if the password is fewer than 8 characters', () => {
    // Arrange
    const userData = {
      username: 'ayamjago',
      password: 'abc',
      fullname: 'John Doe',
    };

    // Action & Assert
    expect(() => new RegisterUser(userData))
      .toThrow('REGISTER_USER.INVALID_PASSWORD_LENGTH');
  });

  it('should create a register user obejct correctly', () => {
    // Arrange
    const userData = {
      username: 'ayamjago',
      password: 'secretpassword',
      fullname: 'John Doe',
    };

    // Action
    const registerUser = new RegisterUser(userData);

    // Assert
    expect(registerUser).toHaveProperty('username', userData.username);
    expect(registerUser).toHaveProperty('password', userData.password);
    expect(registerUser).toHaveProperty('fullname', userData.fullname);
    expect(registerUser).toEqual(userData);
  });
});
