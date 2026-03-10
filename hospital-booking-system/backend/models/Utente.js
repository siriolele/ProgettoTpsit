const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schemaUtente = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ruolo: { type: String, enum: ['utente', 'amministratore'], default: 'utente' },
  codiceFiscale: { type: String, required: true },
  telefono: { type: String, required: true },
  dataRegistrazione: { type: Date, default: Date.now }
});

// Cripta la password prima di salvare
schemaUtente.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Metodo per confrontare le password
schemaUtente.methods.confrontaPassword = async function(passwordCandidata) {
  return await bcrypt.compare(passwordCandidata, this.password);
};

module.exports = mongoose.model('Utente', schemaUtente);