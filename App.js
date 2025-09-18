// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const { connectDB } = require('./config/database');
// const authRoutes = require('./routes/authRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const { swaggerUi, specs } = require('./config/swagger');
// const PORT = process.env.PORT || 3000;
// const router = express.Router();
//
// const app = express();
//
// // app.use(cors({
// //     origin: '*',
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// //     credentials: true
// // }));
//
// app.use(express.json());
// // app.use(cookieParser());
//
// // // Ajout d'un middleware de debug
// // app.use((req, res, next) => {
// //     console.log(`${req.method} ${req.url}`);
// //     next();
// // });
// router.get("/" , (req, res) => {
//     console.log("Route /test appelée"); // Pour vérifier si la route est atteinte
//     res.status(200).json({ message: "Hello world!" });
// });
// // app.use("/auth/", authRoutes);
// // app.use("/contact/", contactRoutes);
// // app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs));
//
// // Démarrage du serveur
// app.listen(PORT, async () => {
//     console.log(`Serveur démarré sur le port ${PORT}`);
//     console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/doc`);
//
//     // try {
//     //     await connectDB();
//     //     console.log('Connexion à la base de données réussie');
//     // } catch (error) {
//     //     console.error('Erreur de connexion à la base de données:', error);
//     // }
// });
const express = require('express');
const app = express()
const port = 3002

app.get('/', (req, res) => {
    console.log("Route / appelée");
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


