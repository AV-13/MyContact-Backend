const authController = require('../authController');
const authService = require('../../services/authService');

// Mock des services
jest.mock('../../services/authService');

describe('Contrôleur d\'authentification', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn()
        };

        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    describe('register', () => {
        test('devrait créer un utilisateur avec succès', async () => {
            req.body = {
                nom: 'Dupont',
                prenom: 'Jean',
                telephone: '0123456789',
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            const userMock = {
                _id: 'user123',
                ...req.body,
                password: 'hashedPassword'
            };

            authService.createUser.mockResolvedValue(userMock);

            await authController.register(req, res);

            expect(authService.createUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Utilisateur créé',
                user: userMock
            });
        });

        test('devrait retourner une erreur 400 si l\'email est déjà utilisé', async () => {
            req.body = {
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            authService.createUser.mockResolvedValue({
                error: 'Un utilisateur avec cet email existe déjà'
            });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Un utilisateur avec cet email existe déjà'
            });
        });

        test('devrait retourner une erreur 500 en cas d\'erreur serveur', async () => {
            req.body = {
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            authService.createUser.mockRejectedValue(new Error('Erreur de base de données'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Erreur serveur'
            });
        });
    });

    describe('login', () => {
        test('devrait connecter l\'utilisateur avec succès', async () => {
            req.body = {
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            const userMock = {
                _id: 'user123',
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@example.com'
            };

            const tokenMock = 'jwt.token.example';

            authService.authenticateUser.mockResolvedValue({
                user: userMock,
                token: tokenMock
            });

            await authController.login(req, res);

            expect(authService.authenticateUser).toHaveBeenCalledWith(
                'jean.dupont@example.com',
                'Password123!'
            );
            expect(res.cookie).toHaveBeenCalledWith('jwtToken', tokenMock, expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Connexion réussie',
                user: userMock
            });
        });

        test('devrait retourner une erreur 400 si les identifiants sont invalides', async () => {
            req.body = {
                email: 'jean.dupont@example.com',
                password: 'mauvaisMotDePasse'
            };

            authService.authenticateUser.mockResolvedValue({
                error: 'Mot de passe incorrect'
            });

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Mot de passe incorrect'
            });
        });

        test('devrait retourner une erreur 500 en cas d\'erreur serveur', async () => {
            req.body = {
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            authService.authenticateUser.mockRejectedValue(new Error('Erreur de base de données'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Erreur lors de la connexion'
            });
        });
    });

    describe('logout', () => {
        test('devrait déconnecter l\'utilisateur avec succès', async () => {
            await authController.logout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith('jwtToken');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Déconnexion réussie'
            });
        });

        test('devrait retourner une erreur 500 en cas d\'erreur serveur', async () => {
            res.clearCookie.mockImplementation(() => {
                throw new Error('Erreur cookie');
            });

            await authController.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Erreur serveur'
            });
        });
    });
});