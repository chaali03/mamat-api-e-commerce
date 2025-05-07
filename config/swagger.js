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
        CartItem: {
          type: 'object',
          properties: {
            product: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            quantity: {
              type: 'number',
              example: 2
            },
            price: {
              type: 'number',
              example: 899000
            }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              }
            },
            totalPrice: {
              type: 'number',
              example: 1798000
            },
            totalItems: {
              type: 'number',
              example: 2
            }
          }
        },
        Wishlist: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            products: {
              type: 'array',
              items: {
                type: 'string',
                example: '60d21b4667d0d8992e610c85'
              }
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
        },
        Review: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            product: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            rating: {
              type: 'number',
              example: 4.5
            },
            title: {
              type: 'string',
              example: 'Keyboard yang sangat bagus'
            },
            review: {
              type: 'string',
              example: 'Keyboard ini sangat nyaman digunakan untuk gaming dan mengetik. Responsif dan tahan lama.'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['review-image-1.jpg', 'review-image-2.jpg']
            },
            verified: {
              type: 'boolean',
              example: true
            },
            likes: {
              type: 'number',
              example: 5
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-15T08:40:51.620Z'
            }
          }
        },
        RatingStats: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 25
            },
            average: {
              type: 'number',
              example: 4.2
            },
            ratings: {
              type: 'object',
              properties: {
                '5': {
                  type: 'number',
                  example: 10
                },
                '4': {
                  type: 'number',
                  example: 8
                },
                '3': {
                  type: 'number',
                  example: 5
                },
                '2': {
                  type: 'number',
                  example: 1
                },
                '1': {
                  type: 'number',
                  example: 1
                }
              }
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