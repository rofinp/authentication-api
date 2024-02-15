const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

module.exports = {
  name: 'authentications',
  register: async (server, { dependencies }) => {
    const authenticationsHandler = new AuthenticationsHandler(dependencies);
    server.route(routes(authenticationsHandler));
  },
};
