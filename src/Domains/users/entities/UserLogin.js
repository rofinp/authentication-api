class UserLogin {
  constructor(loginData) {
    this.verifyLoginData(loginData);

    this.username = loginData.username;
    this.password = loginData.password;
  }

  verifyLoginData({ username, password }) {
    if (!username || !password) {
      throw new Error('USER_LOGIN.MISSING_REQUIRED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.INVALID_DATA_TYPE');
    }
  }
}

module.exports = UserLogin;
