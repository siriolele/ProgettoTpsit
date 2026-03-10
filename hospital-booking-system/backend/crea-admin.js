const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const utenteSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  ruolo: String,
  codiceFiscale: String,
  telefono: String
});

const Utente = mongoose.model('Utente', utenteSchema);

async function creaAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prenotazioni-ospedale');
    
    const adminExists = await Utente.findOne({ email: 'admin@admin.it' });
    
    if (adminExists) {
      console.log('✅ Admin già esistente');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new Utente({
      nome: 'Amministratore',
      email: 'admin@admin.it',
      password: hashedPassword,
      ruolo: 'amministratore',
      codiceFiscale: 'ADMIN80A01H501U',
      telefono: '3331234567'
    });
    
    await admin.save();
    console.log('✅ Admin creato con successo!');
    console.log('📧 Email: admin@admin.it');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Errore:', err);
    process.exit(1);
  }
}

creaAdmin();