require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { swaggerUi, specs } = require('./config/swagger');
const PORT = process.env.PORT || 3000;
const router = express.Router();
const utilRoutes = require('./routes/utilsRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000, https://mycontact-frontend-rk68.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", utilRoutes);
app.use("/auth/", authRoutes);
app.use("/contact/", contactRoutes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, async () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/doc`);
    try {
        await connectDB();
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
    }
});