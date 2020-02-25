const express = require('express');
const router = express.Router();

//MODELO PRINCIPAL DE DATOS
const Instrumento = require('../models/instrumento');

//Modelos auxiliares
const Categoria = require('../models/categoria');

router.get('/nuevoInstrumento', async (req, res) => {
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find();
    res.render('nuevoInstrumento', {categorias, instrumentos});
});

router.post('/crearInstrumento', async (req, res) => {
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
        res.redirect('/nuevoInstrumento');
    }else{
        console.log('Faltan Datos En El Formulario');
        res.redirect('/nuevoInstrumento');      
    }
});

router.post('/editarInstrumento', async (req, res) =>{
    const id = req.body.idInst;
    const instrumento = await Instrumento.findById(id);
    console.log(instrumento.categoria);
    
    const categorias = await Categoria.find();
    res.render('editarInstrumento', {categorias, instrumento});
});

router.post('/actualizarInstrumento/:id', async (req, res) => {
    const {id} = req.params;
    console.log(id);
    await Instrumento.update({_id: id}, req.body)
    res.redirect('/nuevoInstrumento');
});

module.exports = router;