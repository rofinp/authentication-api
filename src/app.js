require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const dependencies = require('./Infrastructures/dependencies');

const start = async () => {
  const server = await createServer(dependencies);
  await server.start();
};

start();
