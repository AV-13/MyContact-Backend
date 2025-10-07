const authService = require('../authService');
const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('../../model/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Service d\'authentification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    describe('createUser', () => {
        test('devrait créer un nouvel utilisateur avec succès', async () => {
            // Arrange
            const userData = {
                nom: 'Dupont',
                prenom: 'Jean',
                telephone: '0123456789',
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('motDePasseHashé');

            const saveMock = jest.fn().mockResolvedValue({
                _id: 'user123',
                ...userData,
                password: 'motDePasseHashé'
            });

            User.mockImplementation(() => ({
                save: saveMock
            }));

            // Act
            const result = await authService.createUser(userData);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(User).toHaveBeenCalledWith({
                ...userData,
                password: 'motDePasseHashé'
            });
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({
                _id: 'user123',
                email: userData.email
            }));
        });

        test('devrait retourner une erreur si l\'email est déjà utilisé', async () => {
            // Arrange
            const userData = {
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@example.com',
                password: 'Password123!'
            };

            User.findOne.mockResolvedValue({ _id: 'existingUser', email: userData.email });

            // Act
            const result = await authService.createUser(userData);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(result).toEqual({
                error: 'Un utilisateur avec cet email existe déjà'
            });
        });
    });

    describe('authenticateUser', () => {
        test('devrait authentifier un utilisateur avec succès', async () => {
            // Arrange
            const email = 'jean.dupont@example.com';
            const password = 'Password123!';

            const userMock = {
                _id: 'user123',
                email,
                password: 'motDePasseHashé'
            };

            User.findOne.mockResolvedValue(userMock);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token.jwt.exemple');

            process.env.JWT_SECRET = 'test_secret';

            // Act
            const result = await authService.authenticateUser(email, password);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, 'motDePasseHashé');
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: userMock._id,
                    email: userMock.email
                },
                'test_secret',
                { expiresIn: '24h' }
            );
            expect(result).toEqual({
                user: userMock,
                token: 'token.jwt.exemple'
            });
        });

        test('devrait retourner une erreur si l\'email n\'existe pas', async () => {
            // Arrange
            const email = 'inconnu@example.com';
            const password = 'Password123!';

            User.findOne.mockResolvedValue(null);

            // Act
            const result = await authService.authenticateUser(email, password);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(result).toEqual({
                error: 'Il n\'existe aucun utilisateur avec cet email'
            });
        });

        test('devrait retourner une erreur si le mot de passe est incorrect', async () => {
            // Arrange
            const email = 'jean.dupont@example.com';
            const password = 'mauvaisMotDePasse';

            const userMock = {
                _id: 'user123',
                email,
                password: 'motDePasseHashé'
            };

            User.findOne.mockResolvedValue(userMock);
            bcrypt.compare.mockResolvedValue(false);

            // Act
            const result = await authService.authenticateUser(email, password);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, 'motDePasseHashé');
            expect(result).toEqual({
                error: 'Mot de passe incorrect'
            });
        });
    });
});