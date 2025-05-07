const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mamat Gaming Products API',
      version: '1.0.0',
      description: 'API for managing gaming peripherals and accessories',
      contact: {
        name: 'Mamat Dev Team',
        email: 'dev@mamat.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.mamat.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              example: 'KB1234'
            },
            name: {
              type: 'string',
              example: 'Aula F2088 Pro Mechanical Keyboard'
            },
            price: {
              type: 'number',
              example: 899000
            },
            category: {
              type: 'string',
              example: 'Keyboard'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Product not found'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'Mamat API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/assets/favicon.ico'
  }));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};