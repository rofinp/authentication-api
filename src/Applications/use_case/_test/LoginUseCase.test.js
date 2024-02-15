const LoginUseCase = require('../LoginUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordEncryptor = require('../../security/PasswordEncryptor');
const NewAuthentication = require('../../../Domains/authentications/entities/NewAuthentication');

describe('LoginUseCase', () => {
  test('it should orchestrates the login action correctly', async () => {
    // Arrange
    const loginData = {
      username: 'ayamjago',
      password: 'supersecret',
    };

    const mockedAuthentication = new NewAuthentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    /* create dependencies of use case */
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockPasswordEncryptor = new PasswordEncryptor();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /* mock required function */
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordEncryptor.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));
    mockAuthenticationTokenManager.generateRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* create the use case instance */
    const getLoginUseCase = new LoginUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      passwordEncryptor: mockPasswordEncryptor,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const authenticatedUserData = await getLoginUseCase.execute(loginData);

    // Assert
    expect(authenticatedUserData).toStrictEqual(mockedAuthentication);

    expect(mockUserRepository.getPasswordByUsername)
      .toHaveBeenCalledWith(loginData.username);
    expect(mockPasswordEncryptor.comparePassword)
      .toHaveBeenCalledWith(loginData.password, 'encrypted_password');
    expect(mockAuthenticationTokenManager.generateAccessToken)
      .toHaveBeenCalledWith({ username: loginData.username });
    expect(mockAuthenticationTokenManager.generateRefreshToken)
      .toHaveBeenCalledWith({ username: loginData.username });
    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith(mockedAuthentication.refreshToken);
  });
});
