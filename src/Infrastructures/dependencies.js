/* istanbul ignore file */

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const BcryptPasswordEncryptor = require('./security/BcryptPasswordEncryptor');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUseCase = require('../Applications/use_case/LoginUseCase');
const LogoutUseCase = require('../Applications/use_case/LogoutUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');

// service container
const serviceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid),
  authenticationRepository: new AuthenticationRepositoryPostgres(pool),
  passwordEncryptor: new BcryptPasswordEncryptor(bcrypt),
  authenticationTokenManager: new JwtTokenManager(jwt.token),
};

// use case container
const useCaseContainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceContainer.userRepository,
    passwordEncryptor: serviceContainer.passwordEncryptor,
  }),
  loginUseCase: new LoginUseCase({
    userRepository: serviceContainer.userRepository,
    authenticationRepository: serviceContainer.authenticationRepository,
    passwordEncryptor: serviceContainer.passwordEncryptor,
    authenticationTokenManager: serviceContainer.authenticationTokenManager,
  }),
  logoutUseCase: new LogoutUseCase({
    authenticationRepository: serviceContainer.authenticationRepository,
  }),
  refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
    authenticationRepository: serviceContainer.authenticationRepository,
    authenticationTokenManager: serviceContainer.authenticationTokenManager,
  }),
};

module.exports = {
  ...serviceContainer,
  ...useCaseContainer,
};
