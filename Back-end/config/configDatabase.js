const { Pool } = require('pg');
// require('dotenv').config({path : '../.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Écouteur : cette ligne est faite pour tester : dès qu'un client se connecte au pool, on log le message
pool.on('connect', () => {
    console.log('✅ Connexion à la BDD réussie !');
});

module.exports = pool;