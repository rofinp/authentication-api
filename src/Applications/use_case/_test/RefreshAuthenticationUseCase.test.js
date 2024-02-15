const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('RefreshAuthenticationUseCase', () => {
  test('it should throw an error if the refresh authentication data does not contain the required property', async () => {
    // Arrange
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
    const refreshTokenData = {};

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(refreshTokenData))
      .rejects.toThrow('REFRESH_AUTHENTICATION_USE_CASE.MISSING_REQUIRED_PROPERTY');
  });

  test('it should throw an error if the refresh authentication data does not meet the data type specifications', async () => {
    // Arrange
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
    const refreshTokenData = {
      refreshToken: {},
    };

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(refreshTokenData))
      .rejects.toThrow('REFRESH_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE');
  });

  test('it should orchestrates the refresh authentication action correctly', async () => {
    // Arrange
    const tokenData = {
      refreshToken: 'valid_refresh_token',
    };

    /* create dependencies of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /* mock required function */
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.isTokenAvailable = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ username: 'ayamjago' }));
    mockAuthenticationTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('valid_access_token'));

    /* create the use case instance */
    const getRefreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await getRefreshAuthenticationUseCase.execute(tokenData);

    // Assert
    expect(accessToken).toEqual('valid_access_token');

    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toHaveBeenCalledWith(tokenData.refreshToken);
    expect(mockAuthenticationRepository.isTokenAvailable)
      .toHaveBeenCalledWith(tokenData.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload)
      .toHaveBeenCalledWith(tokenData.refreshToken);
    expect(mockAuthenticationTokenManager.generateAccessToken)
      .toHaveBeenCalledWith({ username: 'ayamjago' });
  });
});
