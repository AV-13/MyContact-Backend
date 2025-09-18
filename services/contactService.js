const UserContact = require('./../model/UserContact');
const Contact = require('./../model/Contact');

const getUserContacts = async (userId) => {
    try {
        const userContacts = await UserContact.find({ userId })
            .populate('contactId')
            .sort({ createdAt: -1 });
        return userContacts.map(uc => uc.contactId);
    } catch (error) {
        console.error("contactService.getUserContacts: Erreur lors de la récupération des contacts:", error);
    }
}

const getContactById = async (contactId, userId) => {
    try {
        return await Contact.findOne({ _id: contactId, userId });
    } catch (error) {
        console.error("contactService.getContactById: Erreur lors de la récupération du contact:", error);
    }
}
const createContact = async (contactData, userId) => {
    try {
        const contact = new Contact({ ...contactData, userId });
        return await contact.save();
    } catch (error) {
        console.error("contactService.createContact: Erreur lors de la création du contact:", error);
    }
}

module.exports = { getUserContacts, createContact, getContactById };