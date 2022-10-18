const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Sample Calendev App',
      version: '1.0.0',
      description: 'This is sample server for testing Calendev App',
    },
    //testing in local
    host: `localhost:8000`,
    basePath: '/',
  },
  apis: ['server/src/api/routes/users/*.js', 'server/src/config/swagger/*'],
};

const specs = swaggereJsdoc(options);
console.log();

module.exports = {
  swaggerUi,
  specs,
};
