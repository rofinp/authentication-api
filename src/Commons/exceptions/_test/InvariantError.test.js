const InvariantError = require('../InvariantError');
const ClientError = require('../ClientError');

describe('InvariantError', () => {
  test('it should create an InvariantError instance correctly', () => {
    const invariantError = new InvariantError('an error occurrs');

    expect(invariantError).toBeInstanceOf(InvariantError);
    expect(invariantError).toBeInstanceOf(ClientError);
    expect(invariantError).toBeInstanceOf(Error);

    expect(invariantError).toHaveProperty('statusCode', 400);
    expect(invariantError).toHaveProperty('message', 'an error occurrs');
    expect(invariantError).toHaveProperty('name', 'InvariantError');
  });
});
