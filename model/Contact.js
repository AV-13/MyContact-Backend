const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    telephone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        lowercase: true
    },
    adresse: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;