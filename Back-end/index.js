const pool = require('./config/configDatabase');// IMPORT IMPORTANT : On récupère le pool
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:8080']
}));

app.use(express.json());

app.get('/', (req, res) => {
res.send('API Todo List est en ligne !');});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)

const passwordRoutes = require('./routes/passwordRoutes')
app.use('/password', passwordRoutes)

const taskRoutes = require('./routes/taskRoutes')
app.use('/task', taskRoutes)

// --- TEST DE CONNEXION AU DÉMARRAGE ---


app.listen(PORT, '0.0.0.0', async () => {// On force le serveur à dire "Bonjour" à PostgreSQL dès qu'il s'allume
    console.log(`Serveur démarré sur le port ${PORT}`);

    try {
        // On fait une requête simple (SELECT NOW) pour vérifier la connexion
        await pool.query('SELECT NOW()');
        // Le message "✅ Connexion à la BDD réussie !" viendra du fichier database.js
        // grâce à l'événement pool.on('connect')

    } catch (error) {
        console.error('❌ Échec de connexion à la BDD :', error.message);
        process.exit(1);  // Si la BDD ne marche pas, on arrête le serveur, car l'API ne sert à rien sans elle
    }
});


