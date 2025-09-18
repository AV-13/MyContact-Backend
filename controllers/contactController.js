const contactService = require('../services/contactService');

const getUserContacts = async (req, res) => {
    try {
        const contacts = await contactService.getUserContacts(req.user.id);
        res.status(200).json({
            success: true,
            data: contacts,
            count: contacts.length
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

const getContactById = async (req, res) => {
    try {
        const contact = await contactService.getContactById(req.params.id, req.user.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du contact:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

const createContact = async (req, res) => {
    try {
        console.log("Requête de création de contact reçue:", req.body);
        const { nom, prenom, telephone, email, address } = req.body;
        const contactData= { nom, prenom, telephone, email, address  };
        await contactService.createContact(contactData, req.user.id);
        res.status(201).json({
            success: true,
            message: 'Contact créé'
        });
    } catch(error) {
        console.error("Erreur lors de la création du contact:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
}

module.exports = { getUserContacts, getContactById, createContact };