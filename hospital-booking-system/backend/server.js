const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connettiDatabase = require('./config/db');

// Gestione errori globali
process.on('uncaughtException', (err) => {
  console.error('❌ Errore non catturato:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promise non gestita:', err);
});

dotenv.config();
connettiDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/prenotazioni', require('./routes/prenotazioneRoutes'));

// Route di test
app.get('/', (req, res) => {
  res.json({ messaggio: 'Server CUP Sanitario funzionante!' });
});

// Gestione errori 404
app.use('*', (req, res) => {
  res.status(404).json({ errore: 'Route non trovata' });
});

// Gestione errori generale
app.use((err, req, res, next) => {
  console.error('❌ Errore server:', err.stack);
  res.status(500).json({ errore: 'Qualcosa è andato storto!' });
});

const PORTA = process.env.PORTA || 5000;
app.listen(PORTA, () => {
  console.log(`🚀 Server in esecuzione sulla porta ${PORTA}`);
  console.log(`📝 API disponibili:`);
  console.log(`   - POST http://localhost:${PORTA}/api/auth/registrazione`);
  console.log(`   - POST http://localhost:${PORTA}/api/auth/accesso`);
  console.log(`   - GET  http://localhost:${PORTA}/api/auth/profilo`);
});