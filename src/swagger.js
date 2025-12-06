import swaggerAutogen from 'swagger-autogen';


const doc = {
    info: {
        version: '1.0.0',
        title: 'Mentia Academy API Rest',
        description: 'Backend de la web de Mentia Academy'
    },
    host: 'localhost:3000',   // ← CLAVE
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        { name: 'Contact', description: 'Endpoints' },
        { name: 'InfoContact', description: 'Endpoints' },
        { name: 'Subscriber', description: 'Endpoints' },
        { name: 'Subscription', description: 'Endpoints' },
        { name: 'Users', description: 'Endpoints' }
    ],
    securityDefinitions: {},  // by default: empty object
    definitions: {
        Contact: {
            type: 'object',
            required: ['nombre', 'email', 'mensaje'],
            properties: {
                id: {
                    type: 'integer',
                    description: 'ID del contacto'
                },
                nombre: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    description: 'Nombre del contacto'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    maxLength: 150,
                    description: 'Email del contacto'
                },
                telefono: {
                    type: 'string',
                    maxLength: 20,
                    description: 'Teléfono del contacto'
                },
                mensaje: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 1000,
                    description: 'Mensaje del contacto'
                },
                created_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de creación'
                },
                updated_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de actualización'
                }
            }
        },
        InfoContact: {
            type: 'object',
            required: ['nombre', 'email', 'asignatura'],
            properties: {
                id: {
                    type: 'integer',
                    description: 'ID del contacto de información'
                },
                nombre: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    description: 'Nombre del contacto'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    maxLength: 150,
                    description: 'Email del contacto'
                },
                telefono: {
                    type: 'string',
                    maxLength: 20,
                    description: 'Teléfono del contacto'
                },
                asignatura: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 120,
                    description: 'Asignatura de interés'
                },
                created_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de creación'
                },
                updated_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de actualización'
                }
            }
        },
        Subscriber: {
            type: 'object',
            required: ['name', 'email'],
            properties: {
                id: {
                    type: 'integer',
                    description: 'ID del suscriptor'
                },
                name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    description: 'Nombre del suscriptor'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    maxLength: 255,
                    description: 'Email del suscriptor'
                },
                isActive: {
                    type: 'boolean',
                    description: 'Estado del suscriptor'
                },
                created_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de creación'
                },
                updated_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de actualización'
                }
            }
        },
        Users: {

            id: 1,
            name: 'John Doe',
            email: '',
            password: '123456',
            role: 'admin',
            createdAt: '2021-07-15T17:00:00.000Z',
            updatedAt: '2021-07-15T17:00:00.000Z'
        },
        Subscription: {
            type: 'object',
            required: ['priceId', 'email'],
            properties: {
                priceId: {
                    type: 'string',
                    description: 'ID del precio de Stripe'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'Email del cliente'
                },
                subscriptionId: {
                    type: 'string',
                    description: 'ID de la suscripción'
                },
                status: {
                    type: 'string',
                    description: 'Estado de la suscripción'
                },
                success: {
                    type: 'boolean',
                    description: 'Indica si la operación fue exitosa'
                },
                message: {
                    type: 'string',
                    description: 'Mensaje de respuesta'
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
                message: {
                    type: 'string',
                    description: 'Mensaje de error'
                }
            }
        },
        SuccessResponse: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: true
                },
                message: {
                    type: 'string',
                    description: 'Mensaje de éxito'
                },
                data: {
                    type: 'object',
                    description: 'Datos de respuesta'
                }
            }
        }
    }               // by default: empty object
};
const outputFile = './swagger-output.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc).then(async () => {
    await import('./app.js');
});