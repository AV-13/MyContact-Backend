const authService = require("./../services/authService");

const register = async (req, res) => {
    try {
        const { nom, prenom, telephone, email, password } = req.body;
        const user = await authService.createUser({ nom, prenom, telephone, email, password });
        if(user.error) {
            res.status(400).json({ message: user.error });
            return;
        }
        res.status(201).json({ message: 'Utilisateur créé', user });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const {user, token, error } = await authService.authenticateUser(email, password);
        console.log("error message : ", error);
        if (error) {
            res.status(400).json({message: error});
            return;
        }
        console.log("Token généré:", token, "user : ", user, "error : ", error);
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