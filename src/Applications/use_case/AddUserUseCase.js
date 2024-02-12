const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  constructor({ userRepository, passwordEncryptor }) {
    this.userRepository = userRepository;
    this.passwordEncryptor = passwordEncryptor;
  }

  async execute(userData) {
    const registerUser = new RegisterUser(userData);
    await this.userRepository.isUsernameAvailable(registerUser.username);
    registerUser.password = await this.passwordEncryptor.encryptPassword(registerUser.password);
    const addedUser = await this.userRepository.addUser(registerUser);
    return addedUser;
  }
}

module.exports = AddUserUseCase;
