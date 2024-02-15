class LogoutUseCase {
  constructor({ authenticationRepository }) {
    this.authenticationRepository = authenticationRepository;
  }

  async execute(authenticationData) {
    this.verifyAuthenticationData(authenticationData);
    const { refreshToken } = authenticationData;
    await this.authenticationRepository.isTokenAvailable(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }

  verifyAuthenticationData({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('LOGOUT_USE_CASE.MISSING_REQUIRED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('LOGOUT_USE_CASE.INVALID_DATA_TYPE');
    }
  }
}

module.exports = LogoutUseCase;
