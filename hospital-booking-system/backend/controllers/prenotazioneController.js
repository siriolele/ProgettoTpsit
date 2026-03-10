const Prenotazione = require('../models/Prenotazione');
const Utente = require('../models/Utente');

// Genera fasce orarie disponibili (9-17, ogni ora)
const generaFasceOrarie = () => {
  const fasce = [];
  for (let ora = 9; ora <= 17; ora++) {
    fasce.push(`${ora.toString().padStart(2, '0')}:00`);
  }
  return fasce;
};

// Verifica disponibilità per una specifica data e ora
exports.controllaDisponibilita = async (req, res) => {
  try {
    const { data, reparto, ora } = req.query;
    
    const dataObj = new Date(data);
    dataObj.setHours(0, 0, 0, 0);
    
    const prenotazioneEsistente = await Prenotazione.findOne({
      data: dataObj,
      ora,
      reparto,
      stato: { $nin: ['cancellata'] }
    });

    res.json({ disponibile: !prenotazioneEsistente });
  } catch (errore) {
    console.error('Errore controllo disponibilità:', errore);
    res.status(500).json({ errore: errore.message });
  }
};

// Ottieni slot disponibili per una data
exports.fasceDisponibili = async (req, res) => {
  try {
    const { data, reparto } = req.query;
    
    if (!data || !reparto) {
      return res.status(400).json({ errore: 'Data e reparto sono obbligatori' });
    }
    
    const tutteFasce = generaFasceOrarie();
    
    const dataObj = new Date(data);
    dataObj.setHours(0, 0, 0, 0);
    
    const prenotazioniOccupate = await Prenotazione.find({
      data: dataObj,
      reparto,
      stato: { $nin: ['cancellata'] }
    });

    const oreOccupate = prenotazioniOccupate.map(p => p.ora);
    const fasceLibere = tutteFasce.filter(ora => !oreOccupate.includes(ora));

    res.json(fasceLibere);
  } catch (errore) {
    console.error('Errore fasce disponibili:', errore);
    res.status(500).json({ errore: errore.message });
  }
};

// Crea nuova prenotazione
exports.creaPrenotazione = async (req, res) => {
  try {
    const { reparto, medico, data, ora, note } = req.body;

    // Validazione
    if (!reparto || !medico || !data || !ora) {
      return res.status(400).json({ errore: 'Tutti i campi sono obbligatori' });
    }

    const dataObj = new Date(data);
    dataObj.setHours(0, 0, 0, 0);

    // Verifica disponibilità
    const esistente = await Prenotazione.findOne({
      data: dataObj,
      ora,
      reparto,
      stato: { $nin: ['cancellata'] }
    });

    if (esistente) {
      return res.status(400).json({ errore: 'Fascia oraria già occupata' });
    }

    const prenotazione = new Prenotazione({
      utente: req.utenteId,
      reparto,
      medico,
      data: dataObj,
      ora,
      note,
      stato: 'in_attesa',
      statoPagamento: 'in_attesa'
    });

    await prenotazione.save();
    
    await prenotazione.populate('utente', 'nome email telefono');
    
    console.log('✅ Nuova prenotazione creata:', prenotazione._id);
    
    res.status(201).json(prenotazione);
  } catch (errore) {
    console.error('❌ Errore creazione prenotazione:', errore);
    res.status(500).json({ errore: 'Errore durante la prenotazione' });
  }
};

// Ottieni prenotazioni dell'utente
exports.prenotazioniUtente = async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.find({ utente: req.utenteId })
      .populate('utente', 'nome email telefono')
      .sort({ data: 1, ora: 1 });
    
    res.json(prenotazioni);
  } catch (errore) {
    console.error('Errore recupero prenotazioni:', errore);
    res.status(500).json({ errore: errore.message });
  }
};

// Ottieni tutte le prenotazioni (admin)
exports.tuttePrenotazioni = async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.find()
      .populate('utente', 'nome email telefono codiceFiscale')
      .sort({ data: -1, ora: 1 });
    
    res.json(prenotazioni);
  } catch (errore) {
    console.error('Errore recupero tutte prenotazioni:', errore);
    res.status(500).json({ errore: errore.message });
  }
};

// Aggiorna prenotazione
exports.aggiornaPrenotazione = async (req, res) => {
  try {
    const { id } = req.params;
    const aggiornamenti = req.body;
    
    const prenotazione = await Prenotazione.findById(id);
    if (!prenotazione) {
      return res.status(404).json({ errore: 'Prenotazione non trovata' });
    }

    // Verifica permessi
    if (req.ruoloUtente !== 'amministratore' && prenotazione.utente.toString() !== req.utenteId) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    // Se cambia data/ora, verifica disponibilità
    if (aggiornamenti.data || aggiornamenti.ora) {
      const dataObj = aggiornamenti.data ? new Date(aggiornamenti.data) : prenotazione.data;
      dataObj.setHours(0, 0, 0, 0);
      
      const esistente = await Prenotazione.findOne({
        _id: { $ne: id },
        data: dataObj,
        ora: aggiornamenti.ora || prenotazione.ora,
        reparto: aggiornamenti.reparto || prenotazione.reparto,
        stato: { $nin: ['cancellata'] }
      });

      if (esistente) {
        return res.status(400).json({ errore: 'Fascia oraria già occupata' });
      }
    }

    // Se admin, aggiorna tutto; se utente, solo alcune modifiche
    if (req.ruoloUtente === 'amministratore') {
      Object.assign(prenotazione, aggiornamenti);
    } else {
      
      if (aggiornamenti.stato === 'cancellata') {
        prenotazione.stato = 'cancellata';
      }
      if (aggiornamenti.note) {
        prenotazione.note = aggiornamenti.note;
      }
    }

    prenotazione.ultimaModificaDi = req.utenteId;
    await prenotazione.save();
    
    await prenotazione.populate('utente', 'nome email telefono');
    
    res.json(prenotazione);
  } catch (errore) {
    console.error('Errore aggiornamento prenotazione:', errore);
    res.status(500).json({ errore: errore.message });
  }
};

// Processa pagamento
exports.processaPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodoPagamento } = req.body;

    const prenotazione = await Prenotazione.findById(id);
    if (!prenotazione) {
      return res.status(404).json({ errore: 'Prenotazione non trovata' });
    }

    if (prenotazione.utente.toString() !== req.utenteId) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    prenotazione.statoPagamento = 'pagato';
    prenotazione.metodoPagamento = metodoPagamento || 'carta';
    prenotazione.stato = 'confermata';
    await prenotazione.save();

    res.json({ 
      messaggio: 'Pagamento effettuato con successo', 
      prenotazione 
    });
  } catch (errore) {
    console.error('Errore pagamento:', errore);
    res.status(500).json({ errore: 'Errore durante il pagamento' });
  }
};