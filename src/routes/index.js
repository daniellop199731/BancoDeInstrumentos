const express = require('express');
const router = express.Router();

const Sesion = require('../models/sesion');
const Profesor = require('../models/profesor');
const Categoria = require('../models/categoria');
const Instrumento = require('../models/instrumento');

router.get('/', async (req, res) => {
    const categorias = await Categoria.find();
    const sesionActual = await Sesion.find().limit(1);
    const instrumentos = null;
    var profesor = null;
    if (sesionActual.length == 1) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
        haySesion = true;
    }
    res.render('index', { profesor, categorias, instrumentos });
});
/*router.get('/consultarInstrumentos', async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if (sesionActual.length == 1) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual.correo });
        haySesion = true;
    }
    const { categoria } = req.body;
    var filtro = new RegExp(categoria, 'i');
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find({
        $or: [
            { 'categoria': filtro },
            { 'conceptos': filtro }
        ], publicado: 1
    });
    res.render('index', { profesor, categorias, instrumentos });

});*/

router.post('/consultarInstrumentos', async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if (sesionActual.length == 1) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
        haySesion = true;
    }
    const { categoria } = req.body;
    var filtro = new RegExp(categoria, 'i');
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find({
        $or: [
            { 'categoria': filtro },
            { 'conceptos': filtro }
        ], publicado: 1
    });
    res.render('index', { profesor, categorias, instrumentos });

});

module.exports = router;