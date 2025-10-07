const jwt = require('jsonwebtoken');
const { requireAuth } = require('../authMiddleware');

// Mock de jwt
jest.mock('jsonwebtoken');

describe('Middleware d\'authentification', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('devrait retourner 401 si aucun token n\'est fourni', () => {
        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Accès refusé. Token manquant.'
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('devrait appeler next() si le token est valide', () => {
        req.cookies.jwtToken = 'valid-token';
        const mockDecodedToken = { userId: '123' };
        jwt.verify.mockReturnValue(mockDecodedToken);

        requireAuth(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
        expect(req.user).toEqual(mockDecodedToken);
        expect(next).toHaveBeenCalled();
    });

    test('devrait retourner 401 si le token est invalide', () => {
        req.cookies.jwtToken = 'invalid-token';
        jwt.verify.mockImplementation(() => {
            throw new Error('Token invalide');
        });

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token invalide ou expiré.'
        });
        expect(next).not.toHaveBeenCalled();
    });
});