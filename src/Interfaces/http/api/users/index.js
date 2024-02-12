const routes = require('./routes');
const UsersHandler = require('./handler');

module.exports = {
  name: 'users',
  register: async (server, { dependencies }) => {
    const usersHandler = new UsersHandler(dependencies);
    server.route(routes(usersHandler));
  },
};
