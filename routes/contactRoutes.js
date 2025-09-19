const express = require("express");
const router = express.Router();

const { getUserContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const { requireAuth } = require('./../middleware/authMiddleware');
const { validateContact, validateContactForUpdate } = require("../middleware/validationMiddleware");

// Créer un contact
router.post('/create', requireAuth, validateContact, createContact)
// Get all contacts
router.get('/all', requireAuth, getUserContacts);
// get un contact
router.get('/getContact/:id', requireAuth, getContactById);
// modifier un contact
router.patch('/update', requireAuth, validateContactForUpdate, updateContact);
// supprimer un contact
router.delete('/delete/:contactId', requireAuth, deleteContact);

module.exports = router;