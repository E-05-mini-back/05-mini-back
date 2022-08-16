const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    components: {},
    info: {
      title: "Test API",
      version: "1.0.0",
      description: "test api",
    },
    host: "localhost:3000",
    basePath: "/api/",
  },
  apis: ["./routes/*.js", "./swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
