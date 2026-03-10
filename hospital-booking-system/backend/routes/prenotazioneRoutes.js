const express = require('express');
const router = express.Router();
const prenotazioneController = require('../controllers/prenotazioneController');
const { verificaToken, verificaAdmin } = require('./middleware/auth');

// Routes protette (richiedono login)
router.get('/fasce-disponibili', verificaToken, prenotazioneController.fasceDisponibili);
router.get('/controlla-disponibilita', verificaToken, prenotazioneController.controllaDisponibilita);
router.post('/', verificaToken, prenotazioneController.creaPrenotazione);
router.get('/mie-prenotazioni', verificaToken, prenotazioneController.prenotazioniUtente);
router.put('/:id/pagamento', verificaToken, prenotazioneController.processaPagamento);
router.put('/:id', verificaToken, prenotazioneController.aggiornaPrenotazione);

// Routes admin
router.get('/tutte', verificaAdmin, prenotazioneController.tuttePrenotazioni);
router.put('/:id/admin', verificaAdmin, prenotazioneController.aggiornaPrenotazione);

module.exports = router;