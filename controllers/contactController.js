const contactService = require('../services/contactService');

const getUserContacts = async (req, res) => {
    try {
        const contacts = await contactService.getUserContacts(req.user.userId);
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
        console.log("req : ", req, "req.params.userId:", req.query.userId, "req.user.id:", req.user.id);
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

        const { nom, prenom, telephone, email, address } = req.body;
        const contactData= { nom, prenom, telephone, email, address  };
        await contactService.createContact(contactData, req.user.userId);

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

const updateContact = async (req, res) => {
    try {

        const { _id, nom, prenom, telephone, email, address } = req.body;
        const contactData= { nom, prenom, telephone, email, address  };
        const contactId = _id["$oid"];
        console.log("contactId : ", contactId);
        // TODO add a verification that the user that update the contact is the owner of the contact with userId and UserContact model ?
        await contactService.updateContact(contactData, contactId);

        res.status(201).json({
            success: true,
            message: 'Contact modifié'
        });
    } catch(error) {
        console.error("Erreur lors de la création du contact:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
}

const deleteContact = async (req, res) => {
    try {
        console.log("req.params : ", req.params);
        const id = req.params.contactId;
        // TODO
        await contactService.deleteContact(id);
        res.status(200).json({
            success: true,
            message: 'Contact supprimé'
        });
    } catch(error) {
        console.error("Erreur lors de la suppression du contact:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
}

module.exports = { getUserContacts, getContactById, createContact, updateContact, deleteContact };