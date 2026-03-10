const Utente = require('../models/Utente');
const jwt = require('jsonwebtoken');

const generaToken = (utenteId) => {
  return jwt.sign({ utenteId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

exports.registrazione = async (req, res) => {
  try {
    const { nome, email, password, codiceFiscale, telefono } = req.body;

    // Validazione
    if (!nome || !email || !password || !codiceFiscale || !telefono) {
      return res.status(400).json({ errore: 'Tutti i campi sono obbligatori' });
    }

    // Controllo email esistente
    const utenteEsistente = await Utente.findOne({ email });
    if (utenteEsistente) {
      return res.status(400).json({ errore: 'Email già registrata' });
    }

    // Crea nuovo utente
    const utente = new Utente({
      nome,
      email,
      password,
      codiceFiscale: codiceFiscale.toUpperCase(),
      telefono
    });

    await utente.save();

    const token = generaToken(utente._id);
    
    // Risposta senza password
    const utenteResponse = utente.toObject();
    delete utenteResponse.password;
    
    console.log('✅ Nuovo utente registrato:', email);
    
    res.status(201).json({ 
      utente: utenteResponse, 
      token 
    });
  } catch (errore) {
    console.error('❌ Errore registrazione:', errore);
    res.status(500).json({ errore: 'Errore durante la registrazione' });
  }
};

exports.accesso = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ errore: 'Email e password obbligatorie' });
    }

    const utente = await Utente.findOne({ email });
    if (!utente) {
      return res.status(401).json({ errore: 'Credenziali non valide' });
    }

    const passwordCorretta = await utente.confrontaPassword(password);
    if (!passwordCorretta) {
      return res.status(401).json({ errore: 'Credenziali non valide' });
    }

    const token = generaToken(utente._id);
    
    const utenteResponse = utente.toObject();
    delete utenteResponse.password;
    
    console.log('✅ Login effettuato:', email);
    
    res.json({ 
      utente: utenteResponse, 
      token 
    });
  } catch (errore) {
    console.error('❌ Errore accesso:', errore);
    res.status(500).json({ errore: 'Errore durante l\'accesso' });
  }
};

exports.profilo = async (req, res) => {
  try {
    const utente = await Utente.findById(req.utenteId).select('-password');
    if (!utente) {
      return res.status(404).json({ errore: 'Utente non trovato' });
    }
    res.json(utente);
  } catch (errore) {
    console.error('❌ Errore profilo:', errore);
    res.status(500).json({ errore: 'Errore nel recupero del profilo' });
  }
};