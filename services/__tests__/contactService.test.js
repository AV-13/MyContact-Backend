const contactService = require('../contactService');
const UserContact = require('../../model/UserContact');
const Contact = require('../../model/Contact');
const User = require('../../model/User');

// Mocks des modèles
jest.mock('../../model/UserContact');
jest.mock('../../model/Contact');
jest.mock('../../model/User');

describe('Service de contacts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {
        });
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    describe('getUserContacts', () => {
        test('devrait retourner les contacts d\'un utilisateur', async () => {
            // Préparation
            const userId = '123';
            const mockUserContacts = [
                {contactId: {_id: 'contact1', nom: 'Martin'}},
                {contactId: {_id: 'contact2', nom: 'Durand'}}
            ];

            UserContact.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(mockUserContacts)
                })
            });

            // Exécution
            const result = await contactService.getUserContacts(userId);

            // Vérification
            expect(UserContact.find).toHaveBeenCalledWith({userId});
            expect(result).toEqual([
                {_id: 'contact1', nom: 'Martin'},
                {_id: 'contact2', nom: 'Durand'}
            ]);
        });

        test('devrait retourner un tableau vide si aucun contact trouvé', async () => {
            // Préparation
            const userId = '123';

            UserContact.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue([])
                })
            });

            // Exécution
            const result = await contactService.getUserContacts(userId);

            // Vérification
            expect(result).toEqual([]);
        });
    });

    describe('createContact', () => {
        test('devrait créer un nouveau contact et l\'associer à l\'utilisateur', async () => {
            // Préparation
            const contactData = {
                nom: 'Dupont',
                prenom: 'Jean',
                telephone: '0123456789',
                email: 'jean@example.com'
            };
            const userId = '123';

            User.findOne.mockResolvedValue(null);

            const saveMock = jest.fn().mockResolvedValue({
                _id: 'newContactId',
                ...contactData
            });

            Contact.mockImplementation(() => ({
                save: saveMock
            }));

            const userContactSaveMock = jest.fn().mockResolvedValue({
                _id: 'userContactId',
                userId,
                contactId: 'newContactId'
            });

            UserContact.mockImplementation(() => ({
                save: userContactSaveMock
            }));

            // Exécution
            const result = await contactService.createContact(contactData, userId);

            // Vérification
            expect(User.findOne).toHaveBeenCalledWith({telephone: contactData.telephone});
            expect(Contact).toHaveBeenCalledWith(contactData);
            expect(saveMock).toHaveBeenCalled();
            expect(UserContact).toHaveBeenCalledWith({
                userId: userId,
                contactId: 'newContactId'
            });
            expect(userContactSaveMock).toHaveBeenCalled();
            expect(result).toEqual({
                _id: 'newContactId',
                ...contactData
            });
        });
    });

    describe('deleteContact', () => {
        test('devrait supprimer un contact', async () => {
            // Préparation
            const contactId = 'contact1';
            const userId = '123'; // Ajout du userId
            const deletedContact = {
                _id: 'contact1',
                nom: 'Martin',
                prenom: 'Paul'
            };

            Contact.findOneAndDelete.mockResolvedValue(deletedContact);

            // Exécution
            const result = await contactService.deleteContact(contactId, userId);

            // Vérification
            expect(Contact.findOneAndDelete).toHaveBeenCalledWith({
                _id: contactId
                // Note: votre implémentation de deleteContact n'utilise pas le userId
            });
            expect(result).toEqual(deletedContact);
        });
    });
    // Ajoutez les tests manquants
    describe('getContactById', () => {
        test('devrait retourner un contact spécifique', async () => {
            // Préparation
            const contactId = 'contact1';
            const userId = '123';
            const contactMock = {
                _id: contactId,
                nom: 'Martin',
                prenom: 'Paul'
            };

            Contact.findOne.mockResolvedValue(contactMock);

            // Exécution
            const result = await contactService.getContactById(contactId, userId);

            // Vérification
            expect(Contact.findOne).toHaveBeenCalledWith({_id: contactId, userId});
            expect(result).toEqual(contactMock);
        });
    });

    describe('updateContact', () => {
        test('devrait mettre à jour un contact', async () => {
            // Préparation
            const contactId = 'contact1';
            const contactData = {
                nom: 'Martin',
                prenom: 'Paul'
            };
            const updateResult = {modifiedCount: 1};

            Contact.updateOne.mockResolvedValue(updateResult);

            // Exécution
            const result = await contactService.updateContact(contactData, contactId);

            // Vérification
            expect(Contact.updateOne).toHaveBeenCalledWith({_id: contactId}, contactData);
            expect(result).toEqual(updateResult);
        });
    });
});