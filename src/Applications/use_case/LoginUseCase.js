const NewAuthentication = require('../../Domains/authentications/entities/NewAuthentication');
const UserLogin = require('../../Domains/users/entities/UserLogin');

class LoginUseCase {
  constructor({
    userRepository, authenticationRepository, passwordEncryptor, authenticationTokenManager,
  }) {
    this.userRepository = userRepository;
    this.authenticationRepository = authenticationRepository;
    this.passwordEncryptor = passwordEncryptor;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(loginData) {
    const { username, password: plainPassword } = new UserLogin(loginData);
    const encryptedPassword = await this.userRepository.getPasswordByUsername(username);
    await this.passwordEncryptor.comparePassword(plainPassword, encryptedPassword);
    const accessToken = await this.authenticationTokenManager.generateAccessToken({ username });
    const refreshToken = await this.authenticationTokenManager.generateRefreshToken({ username });
    const authenticatedUserData = new NewAuthentication({
      accessToken, refreshToken,
    });
    await this.authenticationRepository.addToken(authenticatedUserData.refreshToken);
    return authenticatedUserData;
  }
}

module.exports = LoginUseCase;
