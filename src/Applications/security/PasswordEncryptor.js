/* eslint-disable no-unused-vars */

class PasswordEncryptor {
  async encryptPassword(plainPassword) {
    throw new Error('PASSWORD_ENCRYPTOR.METHOD_NOT_IMPLEMENTED');
  }

  async comparePassword(plainPassword, encryptedPassword) {
    throw new Error('PASSWORD_ENCRYPTOR.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordEncryptor;
