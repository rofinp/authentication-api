/* istanbul ignore file */

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordEncryptor = require('./security/BcryptPasswordEncryptor');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');

// service container
const serviceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid),
  passwordEncryptor: new BcryptPasswordEncryptor(bcrypt),
};

// use case container
const useCaseContainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceContainer.userRepository,
    passwordEncryptor: serviceContainer.passwordEncryptor,
  }),
};

module.exports = {
  ...serviceContainer,
  ...useCaseContainer,
};
