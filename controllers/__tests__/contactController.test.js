const contactController = require('../contactController');
const contactService = require('../../services/contactService');

// Mock du service de contacts
jest.mock('../../services/contactService');

describe('Contrôleur de contacts', () => {
    let req, res;

    beforeEach(() => {
        // Configuration correcte de req avec tous les champs nécessaires
        req = {
            body: {},
            params: {},
            query: {},
            user: {
                userId: '123',
                id: '123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
        // Éviter les logs consoles pendant les tests
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('getUserContacts', () => {
        test('devrait retourner tous les contacts de l\'utilisateur', async () => {
            const contacts = [
                { _id: 'contact1', nom: 'Jean Dupont' },
                { _id: 'contact2', nom: 'Marie Martin' }
            ];

            contactService.getUserContacts.mockResolvedValue(contacts);

            await contactController.getUserContacts(req, res);

            expect(contactService.getUserContacts).toHaveBeenCalledWith(req.user.userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: contacts,
                count: contacts.length
            });
        });
    });

    describe('getContactById', () => {
        test('devrait retourner un contact spécifique', async () => {
            req.params.id = 'contact1';
            const contact = { _id: 'contact1', nom: 'Jean Dupont' };

            // Mock du console.log pour éviter les erreurs
            console.log = jest.fn();

            contactService.getContactById.mockResolvedValue(contact);

            await contactController.getContactById(req, res);

            expect(contactService.getContactById).toHaveBeenCalledWith('contact1', req.user.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: contact
            });
        });

        test('devrait retourner 404 si le contact n\'est pas trouvé', async () => {
            req.params.id = 'contact-inexistant';

            // Mock du console.log pour éviter les erreurs
            console.log = jest.fn();

            contactService.getContactById.mockResolvedValue(null);

            await contactController.getContactById(req, res);

            expect(contactService.getContactById).toHaveBeenCalledWith('contact-inexistant', req.user.id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Contact non trouvé'
            });
        });
    });

    describe('createContact', () => {
        test('devrait créer un nouveau contact avec succès', async () => {
            req.body = {
                nom: 'Jean',
                prenom: 'Dupont',
                telephone: '0123456789',
                email: 'jean@example.com',
                adresse: 'Paris'
            };

            const contactData = {
                nom: 'Jean',
                prenom: 'Dupont',
                telephone: '0123456789',
                email: 'jean@example.com',
                adresse: 'Paris'
            };

            contactService.createContact.mockResolvedValue({
                _id: 'contact123',
                ...contactData
            });

            await contactController.createContact(req, res);

            expect(contactService.createContact).toHaveBeenCalledWith(contactData, req.user.userId);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Contact créé'
            });
        });

        test('devrait retourner une erreur 400 si données invalides', async () => {
            req.body = {
                nom: 'Jean',
                prenom: 'Dupont'
                // Telephone manquant
            };

            contactService.createContact.mockResolvedValue({
                error: 'Téléphone requis'
            });

            await contactController.createContact(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Téléphone requis'
            });
        });
    });

    describe('updateContact', () => {
        test('devrait mettre à jour un contact avec succès', async () => {
            req.body = {
                _id: 'contact1',
                nom: 'Jean',
                prenom: 'Dupont',
                telephone: '0123456789',
                email: 'jean@example.com',
                adresse: 'Paris'
            };

            contactService.updateContact.mockResolvedValue({
                modifiedCount: 1
            });

            await contactController.updateContact(req, res);

            expect(contactService.updateContact).toHaveBeenCalledWith(
                {
                    nom: 'Jean',
                    prenom: 'Dupont',
                    telephone: '0123456789',
                    email: 'jean@example.com',
                    adresse: 'Paris'
                },
                'contact1'
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Contact modifié'
            });
        });
    });

    describe('deleteContact', () => {
        test('devrait supprimer un contact spécifique', async () => {
            req.params.contactId = 'contact1';

            contactService.deleteContact.mockResolvedValue({
                _id: 'contact1',
                nom: 'Jean Dupont'
            });

            await contactController.deleteContact(req, res);

            // Important: le service est appelé avec un seul paramètre dans le contrôleur
            expect(contactService.deleteContact).toHaveBeenCalledWith('contact1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Contact supprimé'
            });
        });
    });
});