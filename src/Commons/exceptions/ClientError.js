class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);

    if (this.constructor.name === 'ClientError') {
      throw new Error('cannot instantiate an abstract class');
    }

    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}

module.exports = ClientError;
