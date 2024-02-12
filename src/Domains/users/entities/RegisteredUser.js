class RegisteredUser {
  constructor(userData) {
    this.verifyUserData(userData);

    this.id = userData.id;
    this.username = userData.username;
    this.fullname = userData.fullname;
  }

  verifyUserData({ id, username, fullname }) {
    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.MISSING_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.INVALID_DATA_TYPE');
    }
  }
}

module.exports = RegisteredUser;
