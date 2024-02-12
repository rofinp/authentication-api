const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('JwtTokenManager', () => {
  test('it should be instance of AuthenticationTokenManager', () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    expect(jwtTokenManager).toBeInstanceOf(AuthenticationTokenManager);
  });

  describe('generateAccessToken function', () => {
    test('it should generate an accessToken correctly', async () => {
      // Arrange
      const payload = { username: 'ayamjago' };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.generateAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('generateRefreshToken function', () => {
    test('it should generate a refreshToken correctly', async () => {
      // Arrange
      const payload = { username: 'ayamjago' };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    test('it should throw an InvariantError on failed refresh token verification', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const payload = { username: 'ayamjago' };
      const accessToken = await jwtTokenManager.generateAccessToken(payload);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects.toThrow(InvariantError);
    });

    test('it should not throw an InvariantError for a verified refresh token', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const payload = { username: 'ayamjago' };
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    test('it should decode the payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const payload = { username: 'ayamjago' };
      const accessToken = await jwtTokenManager.generateAccessToken(payload);

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('ayamjago');
    });
  });
});
