const authService = require("./../services/authService");

const register = async (req, res) => {
    try {
        const { nom, prenom, telephone, email, password } = req.body;
        const user = await authService.createUser({ nom, prenom, telephone, email, password });
        res.status(201).json({ message: 'Utilisateur créé', user });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const {user, token} = await authService.authenticateUser(email, password);

        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24h
        });

        res.status(200).json({ message: 'Connexion réussie', user });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
}

module.exports = { register, login };