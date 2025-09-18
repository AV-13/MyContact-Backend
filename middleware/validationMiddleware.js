

const validateUser = (req, res, next) => {
    console.log("validateUser middleware called with body:", req.body);
    const { nom, prenom, telephone, email, password } = req.body;
    if (!nom || !prenom || !telephone || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    // TODO mot de passe robuste, mail valide ?
    next();
}

const validateConnection = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    console.log("Middleware validation passed for connection");
    next();
}

const validateContact = (req, res, next) => {
    const { nom, prenom, telephone } = req.body;
    if (!nom || !prenom || !telephone) {
        return res.status(400).json({ message: 'Nom, prénom et téléphone sont requis' });
    }
    next();
}
module.exports = { validateUser, validateConnection, validateContact };