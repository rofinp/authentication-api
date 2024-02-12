class UsersHandler {
  constructor({ addUserUseCase }) {
    this.addUserUseCase = addUserUseCase;
  }

  async postUserHandler(request, h) {
    const addedUser = await this.addUserUseCase.execute(request.payload);
    return h.response({
      status: 'success',
      data: { addedUser },
    }).code(201);
  }
}

module.exports = UsersHandler;
