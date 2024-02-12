const PasswordEncryptor = require('../PasswordEncryptor');

describe('PasswordEncrypter', () => {
  test('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const passwordEncryptor = new PasswordEncryptor();

    // Action & Assert
    await expect(passwordEncryptor.encryptPassword('dummy_password'))
      .rejects.toThrow('PASSWORD_ENCRYPTOR.METHOD_NOT_IMPLEMENTED');

    await expect(passwordEncryptor.comparePassword('plain_password', 'encrypted_password'))
      .rejects.toThrow('PASSWORD_ENCRYPTOR.METHOD_NOT_IMPLEMENTED');
  });
});
