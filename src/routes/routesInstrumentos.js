const express = require('express');
const router = express.Router();

//MODELO PRINCIPAL DE DATOS
const Instrumento = require('../models/instrumento');

//Modelos auxiliares
const Categoria = require('../models/categoria');

router.get('/nuevoInstrumento', async (req, res) => {
    const categorias = await Categoria.find();
    var continuar = true;
    res.render('nuevoInstrumento', {categorias, continuar});
});

router.post('/guardarInstrumento', async (req, res) => {
    const {nombre, descripcion, categoria, objetivos, proposito, t_Duracion, n_Dificultad} = req.body;
    var continuar = true;
    if(nombre == ''){
        continuar = false;
    }
    if(descripcion.value == ''){
        continuar = false;
    }
    if(categoria.value == ''){
        continuar = false;
    }
    if(objetivos.value == ''){
        continuar = false;
    }
    if(proposito.value == ''){
        continuar = false;
    }
    if(t_Duracion.value == ''){
        continuar = false;
    }
    if(n_Dificultad.value == ''){
        continuar = false;
    }
    if(continuar){
        const instrumento = new Instrumento(req.body);
        await instrumento.save();
        const categorias = await Categoria.find();
        res.render('nuevoInstrumento', {categorias});
    }else{
        const categorias = await Categoria.find();
        console.log('Faltan Datos En El Formulario');
        res.render('nuevoInstrumento', {categorias});        
    }
});

module.exports = router;