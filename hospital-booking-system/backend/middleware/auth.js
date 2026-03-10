const jwt = require('jsonwebtoken');
const Utente = require('../models/Utente');

const verificaToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ errore: 'Token non fornito' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const utente = await Utente.findById(decoded.utenteId).select('-password');

    if (!utente) {
      return res.status(401).json({ errore: 'Utente non trovato' });
    }

    req.utente = utente;
    req.utenteId = utente._id;
    req.ruoloUtente = utente.ruolo;
    next();
  } catch (errore) {
    console.error('Errore verifica token:', errore);
    res.status(401).json({ errore: 'Token non valido' });
  }
};

const verificaAdmin = async (req, res, next) => {
  try {
    await verificaToken(req, res, () => {
      if (req.ruoloUtente !== 'amministratore') {
        return res.status(403).json({ errore: 'Accesso negato. Solo amministratori.' });
      }
      next();
    });
  } catch (errore) {
    res.status(401).json({ errore: 'Per favore, effettua il login' });
  }
};

module.exports = { verificaToken, verificaAdmin };