const express = require("express");
const router = express.Router();

const { getUserContacts, getContactById, createContact } = require('../controllers/contactController');
const { requireAuth } = require('./../middleware/authMiddleware');
const { validateContact } = require("../middleware/validationMiddleware");

// Créer un contact
router.post('/create', requireAuth, validateContact, createContact)
// Get all contacts
router.get('/all/:userId', requireAuth, getUserContacts);
// get un contact
router.get('/:contactId', requireAuth, getContactById);
// modifier un contact

// supprimer un contact

module.exports = router;