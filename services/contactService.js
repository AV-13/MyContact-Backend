const UserContact = require('./../model/UserContact');
const Contact = require('./../model/Contact');
const User = require("../model/User");

const getUserContacts = async (userId) => {
    try {
        console.log("userId dans contactService.getUserContacts: ", userId);
        const userContacts = await UserContact.find({ userId })
            .populate('contactId')
            .sort({ createdAt: -1 });
        console.log("contactService.getUserContacts: Contacts récupérés avec succès pour l'utilisateur:", userContacts);
        if (!userContacts || userContacts.length === 0) {
            return [];
        }

        console.log("contactService.getUserContacts: Contacts récupérés avec succès pour l'utilisateur:", userContacts);
        return userContacts
            .filter(uc => uc.contactId)
            .map(uc => uc.contactId);
    } catch (error) {
        console.error("contactService.getUserContacts: Erreur lors de la récupération des contacts:", error);
        throw error;
    }
}
const getContactById = async (contactId, userId) => {
    try {
        return await Contact.findOne({ _id: contactId, userId });
    } catch (error) {
        console.error("contactService.getContactById: Erreur lors de la récupération du contact:", error);
        throw error;
    }
}
const createContact = async (contactData, userId) => {
    try {
        let savedContact;
        const existingContact = await User.findOne({ telephone: contactData.telephone });

        if (existingContact) {
            const id = existingContact._id;
            const existingContactForUser = await UserContact.findOne({userId: userId, contactId: id})

            if (existingContactForUser) {
                return { error: "Ce contact existe déjà dans votre répertoire." };
            }
        }
        else {
        const contact = new Contact(contactData);
        savedContact = await contact.save();
        }
        const id = existingContact ? existingContact._id : savedContact._id;

        const userContact = new UserContact({
            userId: userId,
            contactId: id
        });
        await userContact.save();

       return existingContact ? existingContact : savedContact;
    } catch (error) {
        console.error("contactService.createContact: Erreur lors de la création du contact:", error);
        throw error;
    }
}
const updateContact = async (contactData, contactId) => {
    try {
        console.log("contactService.updateContact: Mise à jour du contact avec ID:", contactId, "Données:", contactData);
        return Contact.updateOne({ _id: contactId }, contactData);
    } catch (error) {
        console.error("contactService.createContact: Erreur lors de la création du contact:", error);
        throw error;
    }
}
const deleteContact = async(contactId, userId) => {
    try {
        const contact = await Contact.findOneAndDelete({ _id: contactId });
        return contact;
    } catch(error) {
        console.error("contactService.deleteContact: Erreur lors de la suppression du contact:", error);
        throw error;
    }
}

module.exports = { getUserContacts, createContact, getContactById, updateContact, deleteContact };