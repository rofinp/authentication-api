const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  test('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository();
    // Action & Assert
    await expect(() => userRepository.addUser({}))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => userRepository.isUsernameAvailable(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => userRepository.getPasswordByUsername(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
