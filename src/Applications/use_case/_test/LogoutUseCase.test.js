const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const LogoutUseCase = require('../LogoutUseCase');

describe('LogoutUseCase', () => {
  test('it should throw an error if the refresh authentication data does not contain the required property ', async () => {
    // Arrange
    const logoutUseCase = new LogoutUseCase({});
    const authenticationData = {};

    // Action & Assert
    await expect(logoutUseCase.execute(authenticationData))
      .rejects.toThrow('LOGOUT_USE_CASE.MISSING_REQUIRED_PROPERTY');
  });

  test('it should throw an error if the refresh authentication data does not meet the data type specifications', async () => {
    // Arrange
    const logoutUseCase = new LogoutUseCase({});
    const authenticationData = { refreshToken: 123 };

    // Action & Assert
    await expect(logoutUseCase.execute(authenticationData))
      .rejects.toThrow('LOGOUT_USE_CASE.INVALID_DATA_TYPE');
  });

  test('it should orchestrates the logout action correctly', async () => {
    // Arrange
    const authenticationData = { refreshToken: 'valid_refresh_token' };

    /* create dependencies of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();

    /* mock required function */
    mockAuthenticationRepository.isTokenAvailable = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* create the use case instance */
    const getLogoutUseCase = new LogoutUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await getLogoutUseCase.execute(authenticationData);

    // Assert
    expect(mockAuthenticationRepository.isTokenAvailable)
      .toHaveBeenCalledWith(authenticationData.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(authenticationData.refreshToken);
  });
});
