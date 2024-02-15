class RefreshAuthenticationUseCase {
  constructor({ authenticationRepository, authenticationTokenManager }) {
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(authenticationData) {
    this.verifyRefreshToken(authenticationData);
    const { refreshToken } = authenticationData;
    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.isTokenAvailable(refreshToken);
    const { username } = await this.authenticationTokenManager.decodePayload(refreshToken);
    const accessToken = await this.authenticationTokenManager.generateAccessToken({ username });
    return accessToken;
  }

  verifyRefreshToken({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.MISSING_REQUIRED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE');
    }
  }
}

module.exports = RefreshAuthenticationUseCase;
