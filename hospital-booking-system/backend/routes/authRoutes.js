const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificaToken } = require('./middleware/auth');

// Routes pubbliche
router.post('/registrazione', authController.registrazione);
router.post('/accesso', authController.accesso);

// Routes protette
router.get('/profilo', verificaToken, authController.profilo);

module.exports = router;