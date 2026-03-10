const mongoose = require('mongoose');

const connettiDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prenotazioni-ospedale');
    console.log('✅ Database MongoDB connesso con successo');
  } catch (errore) {
    console.error('❌ Errore connessione database:', errore);
    process.exit(1);
  }
};

module.exports = connettiDatabase;