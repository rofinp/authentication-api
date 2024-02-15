const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator.directories[error.message] || error;
  },
};

DomainErrorTranslator.directories = {
  'REGISTER_USER.MISSING_REQUIRED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.INVALID_DATA_TYPE': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.INVALID_USERNAME_LENGTH': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.INVALID_USERNAME_FORMAT': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'REGISTER_USER.INVALID_PASSWORD_LENGTH': new InvariantError('tidak dapat membuat user baru karena password kurang dari delapan karakter'),

  'USER_LOGIN.MISSING_REQUIRED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.INVALID_DATA_TYPE': new InvariantError('username dan password harus string'),

  'REFRESH_AUTHENTICATION_USE_CASE.MISSING_REQUIRED_PROPERTY': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.INVALID_DATA_TYPE': new InvariantError('refresh token harus string'),

  'LOGOUT_USE_CASE.MISSING_REQUIRED_PROPERTY': new InvariantError('harus mengirimkan token refresh'),
  'LOGOUT_USE_CASE.INVALID_DATA_TYPE': new InvariantError('refresh token harus string'),
};

module.exports = DomainErrorTranslator;
