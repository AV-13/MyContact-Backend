const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    apis: [],
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
                        _id: { type: 'string', description: 'ID unique de l\'utilisateur' },
                        nom: { type: 'string', description: 'Nom de famille' },
                        prenom: { type: 'string', description: 'Prénom' },
                        telephone: { type: 'string', description: 'Numéro de téléphone' },
                        email: { type: 'string', format: 'email', description: 'Adresse email' },
                        password: { type: 'string', description: 'Mot de passe' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Contact: {
                    type: 'object',
                    required: ['nom', 'prenom', 'telephone'],
                    properties: {
                        _id: { type: 'string', description: 'ID unique du contact' },
                        nom: { type: 'string', description: 'Nom de famille' },
                        prenom: { type: 'string', description: 'Prénom' },
                        telephone: { type: 'string', description: 'Numéro de téléphone' },
                        email: { type: 'string', format: 'email', description: 'Adresse email (optionnel)' },
                        userId: { type: 'string', description: 'ID de l\'utilisateur propriétaire' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Message d\'erreur' },
                    },
                },
            },
        },
        paths: {
            '/auth/register': {
                post: {
                    summary: 'Inscription d\'un nouvel utilisateur',
                    tags: ['Auth'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/User' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Utilisateur créé' },
                        400: { description: 'Erreur d\'inscription', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/auth/login': {
                post: {
                    summary: 'Connexion d\'un utilisateur',
                    tags: ['Auth'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string' },
                                        password: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Connexion réussie' },
                        400: { description: 'Erreur de connexion', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/auth/logout': {
                get: {
                    summary: 'Déconnexion de l\'utilisateur',
                    tags: ['Auth'],
                    responses: {
                        200: { description: 'Déconnexion réussie' }
                    }
                }
            },
            '/contact/create': {
                post: {
                    summary: 'Créer un contact',
                    tags: ['Contact'],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Contact' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Contact créé' },
                        400: { description: 'Erreur de création', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/contact/all': {
                get: {
                    summary: 'Récupérer tous les contacts de l\'utilisateur',
                    tags: ['Contact'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Liste des contacts',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Contact' }
                                    }
                                }
                            }
                        },
                        401: { description: 'Non autorisé' }
                    }
                }
            },
            '/contact/getContact/{id}': {
                get: {
                    summary: 'Récupérer un contact par ID',
                    tags: ['Contact'],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: 'ID du contact'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Contact trouvé',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } }
                        },
                        404: { description: 'Contact non trouvé' }
                    }
                }
            },
            '/contact/update': {
                patch: {
                    summary: 'Mettre à jour un contact',
                    tags: ['Contact'],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Contact' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Contact modifié' },
                        400: { description: 'Erreur de modification', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/contact/delete/{contactId}': {
                delete: {
                    summary: 'Supprimer un contact',
                    tags: ['Contact'],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'contactId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: 'ID du contact à supprimer'
                        }
                    ],
                    responses: {
                        200: { description: 'Contact supprimé' },
                        400: { description: 'Erreur de suppression', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/whoami': {
                get: {
                    summary: 'Vérifier l\'authentification de l\'utilisateur',
                    tags: ['Utils'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Utilisateur authentifié' },
                        401: { description: 'Non authentifié' }
                    }
                }
            }
        }
    }
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};