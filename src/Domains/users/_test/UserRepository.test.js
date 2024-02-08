const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange, Action & Assert
    await expect(() => UserRepository.addUser({}))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => UserRepository.isUsernameAvailable(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => UserRepository.getIdByUsername(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => UserRepository.getPasswordByUsername(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
