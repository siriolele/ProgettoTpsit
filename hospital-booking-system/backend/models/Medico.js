const mongoose = require('mongoose');

const schemaMedico = new mongoose.Schema({
  nome: { type: String, required: true },
  reparto: { 
    type: String, 
    enum: ['Cardiologia', 'Oculistica', 'Ortopedia', 'Pediatria', 'Chirurgia'],
    required: true 
  },
  specializzazione: { type: String },
  disponibile: { type: Boolean, default: true }
});

module.exports = mongoose.model('Medico', schemaMedico);