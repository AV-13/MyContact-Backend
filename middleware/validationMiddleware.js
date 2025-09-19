

const validateUser = (req, res, next) => {
    console.log("validateUser middleware called with body:", req.body);
    const { nom, prenom, telephone, email, password } = req.body;
    if (!nom || !prenom || !telephone || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    if(telephone.length <= 10 || telephone.length > 20) {
        return res.status(400).json({ message: 'Le numéro de téléphone doit être compris entre 10 et 20 caractères' });
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
    console.log("validateContact middleware called with body:", req.body);
    const { nom, prenom, telephone } = req.body;
    if (!nom || !prenom || !telephone) {
        return res.status(400).json({ message: 'Nom, prénom et téléphone sont requis' });
    }
    next();
}
const validateContactForUpdate = (req, res, next) => {
    console.log("validateContact middleware called with body:", req.body);
    const { _id, nom, prenom, telephone } = req.body;
    if(!_id) {
        return res.status(400).json({
            message: 'Une erreur interne est survenue: Missing ObjectId'

        });
    }
    if (!nom || !prenom || !telephone) {
        return res.status(400).json({ message: 'Nom, prénom et téléphone sont requis' });
    }
    next();
}
module.exports = { validateUser, validateConnection, validateContact, validateContactForUpdate };