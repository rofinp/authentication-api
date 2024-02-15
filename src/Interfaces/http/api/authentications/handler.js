class AuthenticationsHandler {
  constructor({ loginUseCase, logoutUseCase, refreshAuthenticationUseCase }) {
    this.loginUseCase = loginUseCase;
    this.logoutUseCase = logoutUseCase;
    this.refreshAuthenticationUseCase = refreshAuthenticationUseCase;
  }

  async postAuthenticationHandler(request, h) {
    const { accessToken, refreshToken } = await this.loginUseCase.execute(request.payload);
    return h.response({
      status: 'success',
      data: { accessToken, refreshToken },
    }).code(201);
  }

  async putAuthenticationHandler(request) {
    const accessToken = await this.refreshAuthenticationUseCase.execute(request.payload);
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    await this.logoutUseCase.execute(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
