class RegisterUser {
  constructor(userData) {
    RegisterUser.verifyUserData(userData);

    this.username = userData.username;
    this.password = userData.password;
    this.fullname = userData.fullname;
  }

  static verifyUserData({ username, password, fullname }) {
    if (!username || !password || !fullname) {
      throw new Error('REGISTER_USER.MISSING_REQUIRED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTER_USER.INVALID_DATA_TYPE');
    }

    if (username.length < 6 || username.length > 50) {
      throw new Error('REGISTER_USER.INVALID_USERNAME_LENGTH');
    }

    if (!/^\w+$/.test(username)) {
      throw new Error('REGISTER_USER.INVALID_USERNAME_FORMAT');
    }

    if (password.length < 8) {
      throw new Error('REGISTER_USER.INVALID_PASSWORD_LENGTH');
    }
  }
}

module.exports = RegisterUser;
