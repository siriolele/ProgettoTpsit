const mongoose = require('mongoose');

const schemaPrenotazione = new mongoose.Schema({
  utente: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
  reparto: { 
    type: String, 
    enum: ['Cardiologia', 'Oculistica', 'Ortopedia', 'Pediatria', 'Chirurgia'],
    required: true 
  },
  medico: { type: String, required: true },
  data: { type: Date, required: true },
  ora: { type: String, required: true },
  stato: { 
    type: String, 
    enum: ['in_attesa', 'confermata', 'cancellata', 'pagata', 'riprogrammata'],
    default: 'in_attesa'
  },
  statoPagamento: { 
    type: String, 
    enum: ['in_attesa', 'pagato', 'rimborsato'],
    default: 'in_attesa'
  },
  metodoPagamento: { type: String, enum: ['contanti', 'carta', 'bonifico'] },
  note: { type: String },
  dataCreazione: { type: Date, default: Date.now },
  ultimaModificaDi: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente' }
});

module.exports = mongoose.model('Prenotazione', schemaPrenotazione);