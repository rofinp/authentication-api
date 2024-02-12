class NewAuthentication {
  constructor(authData) {
    this.verifyAuthenticationData(authData);

    this.accessToken = authData.accessToken;
    this.refreshToken = authData.refreshToken;
  }

  verifyAuthenticationData({ accessToken, refreshToken }) {
    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTHENTICATION.MISSING_REQUIRED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTHENTICATION.INVALID_DATA_TYPE');
    }
  }
}

module.exports = NewAuthentication;
