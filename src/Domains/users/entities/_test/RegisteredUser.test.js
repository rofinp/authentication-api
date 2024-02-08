const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser entitiy', () => {
  it('should throw an error if the user data does not contain the required property', () => {
    // Arrange
    const userData = {
      username: 'ayamjago',
      fullname: 'John Doe',
    };

    // Action & Assert
    expect(() => new RegisteredUser(userData))
      .toThrow('REGISTERED_USER.MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error if the user data does not meet the data type specifications', () => {
    // Arrange
    const userData = {
      id: {},
      username: true,
      fullname: 123,
    };

    // Action & Assert
    expect(() => new RegisteredUser(userData))
      .toThrow('REGISTERED_USER.INVALID_DATA_TYPE');
  });

  it('should create a registered user onject correctly', () => {
    // Arrange
    const userData = {
      id: 'user-123',
      username: 'ayamjago',
      fullname: 'John Doe',
    };

    // Action
    const registeredUser = new RegisteredUser(userData);

    // Assert
    expect(registeredUser).toHaveProperty('id', userData.id);
    expect(registeredUser).toHaveProperty('username', userData.username);
    expect(registeredUser).toHaveProperty('fullname', userData.fullname);
    expect(registeredUser).toEqual(userData);
  });
});
