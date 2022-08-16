const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    components: {},
    // openapi: "3.0.3",
    info: {
      title: "Test API",
      version: "1.0.0",
      description: "test api",
    },
    // servers: [
    //   {
    //     url: "http://localhost:3000/api/",
    //   },
    // ],
    // components: {
    securityDefinitions: {
      Authorization: {
        type: "apiKey",
        name: "authorization",
        scheme: "bearer",
        in: "header",
      },
    },
    // },
    security: [
      {
        Authorization: [],
      },
    ],
    host: "localhost:3000",
    basePath: "/api/",
  },
  apis: ["./routes/*.js", "./swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
