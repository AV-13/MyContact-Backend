const mongoose = require('mongoose');

const userContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    }
}, {
    timestamps: true
});

userContactSchema.index({ userId: 1, contactId: 1 }, { unique: true });

module.exports = mongoose.model('UserContact', userContactSchema);