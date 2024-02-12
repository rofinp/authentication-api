const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordEncryptor = require('../../security/PasswordEncryptor');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  test('it should orchestrates the add user action correctly', async () => {
    // Arrange
    const userData = new RegisterUser({
      username: 'ayambakar',
      password: 'supersecret',
      fullname: 'John Doe',
    });

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: userData.username,
      fullname: userData.fullname,
    });

    /* create dependencies of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordEncryptor = new PasswordEncryptor();

    /* mock required function */
    mockPasswordEncryptor.encryptPassword = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    mockUserRepository.isUsernameAvailable = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredUser({
        id: mockRegisteredUser.id,
        username: mockRegisteredUser.username,
        fullname: mockRegisteredUser.fullname,
      })));

    /* create the use case instance */
    const getAddUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordEncryptor: mockPasswordEncryptor,
    });

    // Action
    const registeredUser = await getAddUserUseCase.execute(userData);

    // Assert
    expect(registeredUser).toStrictEqual(mockRegisteredUser);

    expect(mockPasswordEncryptor.encryptPassword).toHaveBeenCalledWith(userData.password);
    expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith(userData.username);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(new RegisterUser({
      username: userData.username,
      password: 'encrypted_password',
      fullname: userData.fullname,
    }));
  });
});
