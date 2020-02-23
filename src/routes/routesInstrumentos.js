const express = require('express');
const router = express.Router();

const Instrumento = require('../models/instrumento');

router.get('/nuevoInstrumento', (req, res) => {
    res.render('nuevoInstrumento');
});

router.post('/guardarInstrumento', async (req, res) => {
    const instrumento = new Instrumento(req.body);
    await instrumento.save();
    res.send('Se le tiene');
});

module.exports = router;