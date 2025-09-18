const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtToken;
    console.log("Token reçu :", token);
    if (!token) {
        return res.status(401).json({
            message: 'Accès refusé. Token manquant.'
        });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalide ou expiré.'
        });
    }
};

module.exports = { requireAuth };