// server/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Tentative de connexion à:', process.env.MONGODB_URI?.substring(0, 50) + '...');
        console.log('Nom de la base de données:', process.env.DB_NAME);

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'mycontact'
        });

        console.log('MongoDB connecté avec succès');
        console.log('Host:', mongoose.connection.host);
        console.log('Database:', mongoose.connection.name);
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB };