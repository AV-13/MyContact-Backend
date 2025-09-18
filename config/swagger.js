const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MyContact API',
            version: '1.0.0',
            description: 'API de gestion de contacts avec authentification',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['nom', 'prenom', 'telephone', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID unique de l\'utilisateur',
                        },
                        nom: {
                            type: 'string',
                            description: 'Nom de famille',
                        },
                        prenom: {
                            type: 'string',
                            description: 'Prénom',
                        },
                        telephone: {
                            type: 'string',
                            description: 'Numéro de téléphone',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Adresse email',
                        },
                        password: {
                            type: 'string',
                            description: 'Mot de passe',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Contact: {
                    type: 'object',
                    required: ['nom', 'prenom', 'telephone'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID unique du contact',
                        },
                        nom: {
                            type: 'string',
                            description: 'Nom de famille',
                        },
                        prenom: {
                            type: 'string',
                            description: 'Prénom',
                        },
                        telephone: {
                            type: 'string',
                            description: 'Numéro de téléphone',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Adresse email (optionnel)',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID de l\'utilisateur propriétaire',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Message d\'erreur',
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};