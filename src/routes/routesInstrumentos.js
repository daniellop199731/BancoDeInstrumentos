const express = require('express');
const router = express.Router();

//MODELO PRINCIPAL DE DATOS
const Instrumento = require('../models/instrumento');
const consultar = require('../models/categoria');
//Modelos auxiliares
const Categoria = require('../models/categoria');
const NivelDificultad = require('../models/nivel_dificultad');
const TiempoDuracion = require('../models/tiempo_duracion');
//Para control de sesion
const Sesion = require('../models/sesion');
const Profesor = require('../models/profesor');

//Borrar si no sirve
//const instrumentos = require('../models/instrumento')

router.get('/nuevoInstrumento', async (req, res) => {

    //APLICA SESION
    const sesionActual = await Sesion.find().limit(1);
    var haySesion = false;
    var profesor = null;
    if(sesionActual.length == 1){
        profesor = await Profesor.find({correo: sesionActual[0].correo});
        haySesion = true;
    }  
    /* NO APLICA SESION
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find();
    const nivelesDificultad = await NivelDificultad.find();
    const tiemposDuracion = await TiempoDuracion.find();    
    res.render('nuevoInstrumento', {categorias, instrumentos, nivelesDificultad, tiemposDuracion,});
    */
    //APLICA SESION  
    if(haySesion){
        const categorias = await Categoria.find();
        const instrumentos = await Instrumento.find({correoAutor: profesor[0].correo});
        const nivelesDificultad = await NivelDificultad.find();
        const tiemposDuracion = await TiempoDuracion.find();        
        //res.render('index', {profesor});
        res.render('nuevoInstrumento', {categorias, instrumentos, nivelesDificultad, tiemposDuracion, profesor});
    }else{
        res.render('index', {profesor});
    }    
});

router.post('/crearInstrumento', async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
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
        await Instrumento.updateOne({_id: instrumento._id}, {$set: {correoAutor: sesionActual[0].correo}});
        res.redirect('/nuevoInstrumento');
    }else{
        console.log('Faltan Datos En El Formulario');
        res.redirect('/nuevoInstrumento');      
    }
});

router.post('/editarInstrumento', async (req, res) =>{

    //APLICA SESION
    const sesionActual = await Sesion.find().limit(1);
    var haySesion = false;
    var profesor = null;
    if(sesionActual.length == 1){
        profesor = await Profesor.find({correo: sesionActual[0].correo});
        haySesion = true;
    } 
    
    const id = req.body.idInst;
    const instrumento = await Instrumento.findById(id);

    const tiempoduracion = await TiempoDuracion.findById(id);
    const nivel_dificultad = await NivelDificultad.findById(id);
    
    const categorias = await Categoria.find();
    res.render('editarInstrumento', {categorias, instrumento, tiempoduracion, nivel_dificultad, profesor});
});

router.get('/actualizarInstrumento/:id', async (req, res) => {
    const {id} = req.params;
    await Instrumento.update({_id: id}, req.query)
    res.redirect('/nuevoInstrumento');
});

router.get('/eliminarInstrumento', async (req, res) =>{
    const id = req.query.idInst;
    await Instrumento.deleteOne({_id:id});
    res.redirect('/nuevoInstrumento');

    //instrumento.findOneAndRemove({_id: req.params.id},function(error){

      //  if(!error){
      //      res.redirect('/nuevoInstrumento')
      //  }else{
      //      console.log(error)
      //      res.redirect('/nuevoInstrumento')
       // }
    //})
});

/*router.post('/crearInstrumento', async (req, res) => {
    const instrumento = new instrumentos({
        content: req.body.content

    });

    try {
        await instrumento.save();
        res.redirect('/nuevoInstrumento');

    } catch (err){
        res.redirect('/nuevoInstrumento');
    }

});*/

router.get('/publicarInstrumento', async (req, res) => {
    const id = req.query.idInst;
    const instrumento = await Instrumento.findById(id);
    if(instrumento.publicado == 1){
        await Instrumento.findByIdAndUpdate({ _id: id }, { publicado: 0 });
    }else{
        await Instrumento.findByIdAndUpdate({ _id: id }, { publicado: 1 });
    }
    res.redirect('/nuevoInstrumento')

});

module.exports = router;