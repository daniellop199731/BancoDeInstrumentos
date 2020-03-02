const express = require('express');
const router = express.Router();

//MODELO PRINCIPAL DE DATOS
const Instrumento = require('../models/instrumento');

//Modelos auxiliares
const Categoria = require('../models/categoria');
const NivelDificultad = require('../models/nivel_dificultad');
const TiempoDuracion = require('../models/tiempo_duracion');

router.get('/nuevoInstrumento', async (req, res) => {
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find();
    const nivelesDificultad = await NivelDificultad.find();
    const tiemposDuracion = await TiempoDuracion.find();
    res.render('nuevoInstrumento', {categorias, instrumentos, nivelesDificultad, tiemposDuracion});
});

router.post('/crearInstrumento', async (req, res) => {
    const {nombre, descripcion, categoria, objetivos, proposito, t_Duracion, n_Dificultad, material, reglas, conceptos, numeroIntegrantes} = req.body;
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
    if(material.value == ''){
        continuar = false;
    }
    if(reglas.value == ''){
        continuar = false;
    }
    if(conceptos.value == ''){
        continuar = false;
    }
    if(numeroIntegrantes.value == ''){
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

    const tiempoduracion = await TiempoDuracion.findById(id);
    const nivel_dificultad = await NivelDificultad.findById(id);


    console.log(instrumento.categoria);
    console.log(instrumento.n_Dificultad);
    
    const categorias = await Categoria.find();
    res.render('editarInstrumento', {categorias, instrumento, tiempoduracion, nivel_dificultad});
});

router.post('/actualizarInstrumento/:id', async (req, res) => {
    const {id} = req.params;
    console.log(id);
    await Instrumento.update({_id: id}, req.body)
    res.redirect('/nuevoInstrumento');
});

module.exports = router;