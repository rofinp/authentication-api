const bcrypt = require('bcrypt');
const BcryptPasswordEncryptor = require('../BcryptPasswordEncryptor');
const PasswordEncryptor = require('../../../Applications/security/PasswordEncryptor');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordEncryptor', () => {
  test('it should be instance of PasswordEncryptor interface', async () => {
    // Arrange
    const bcryptPasswordEncryptor = new BcryptPasswordEncryptor();

    // Action & Assert
    expect(bcryptPasswordEncryptor).toBeInstanceOf(PasswordEncryptor);
  });

  describe('encryptPassword function', () => {
    test('it should encrypt the user plain password correctly', async () => {
      // Arrange
      const spyEcryptPassword = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordEncryptor = new BcryptPasswordEncryptor(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordEncryptor.encryptPassword('plain_password');

      // Assert
      expect(spyEcryptPassword).toHaveBeenCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordEncryptor
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
    });
  });

  describe('comparePassword function', () => {
    test('it should throw an AuthenticationError if the password does not match', async () => {
      // Arrange
      const bcryptPasswordEncryptor = new BcryptPasswordEncryptor(bcrypt);

      // Act & Assert
      await expect(bcryptPasswordEncryptor.comparePassword('plain_password', 'encrypted_password'))
        .rejects.toThrow(AuthenticationError);
    });

    test('it should not return an AuthenticationError for a matching password', async () => {
      // Arrange
      const bcryptPasswordEncryptor = new BcryptPasswordEncryptor(bcrypt);
      const plainPassword = 'secretpassword';
      const encryptedPassword = await bcryptPasswordEncryptor.encryptPassword(plainPassword);

      // Act & Assert
      await expect(bcryptPasswordEncryptor.comparePassword(plainPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError);
    });
  });
});
