const securityRoute = async (req, res) => {
    try {
        res.status(200).json({
            message: "Accès à une route protégée réussi",
            user: req.user
        })
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
}

module.exports = { securityRoute };