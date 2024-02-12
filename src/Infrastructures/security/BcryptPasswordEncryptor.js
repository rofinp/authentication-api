const PasswordEncryptor = require('../../Applications/security/PasswordEncryptor');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordEncryptor extends PasswordEncryptor {
  constructor(bcrypt, saltRound = 10) {
    super();
    this.bcrypt = bcrypt;
    this.saltRound = saltRound;
  }

  async encryptPassword(plainPassword) {
    return this.bcrypt.hash(plainPassword, this.saltRound);
  }

  async comparePassword(plainPassword, encryptedPassword) {
    const result = await this.bcrypt.compare(plainPassword, encryptedPassword);
    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptPasswordEncryptor;
