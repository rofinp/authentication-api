const ClientError = require('../ClientError');

describe('ClientError', () => {
  test('should throw an error when the abstract class is called directly', () => {
    expect(() => new ClientError('')).toThrow('cannot instantiate an abstract class');
  });
});
