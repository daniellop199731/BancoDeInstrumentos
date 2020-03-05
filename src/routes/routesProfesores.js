const express = require('express');
const router = express.Router();

const Sesion = require('../models/sesion');
const Profesor = require('../models/profesor');

router.get('/nuevoProfesor',  async (req, res) => {

    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if(sesionActual.length == 1){
        console.log(sesionActual);
        profesor = await Profesor.find({correo: sesionActual.correo});
    }
    res.render('nuevoProfesor', {profesor});
});

router.post('/crearProfesor', async (req, res) => {
    const {correo, contrasena, contrasena2, nombre, apellido, institucion} = req.body;
    var continuar = true;
    const profesor2 = await Profesor.findOne({correo: correo});
    if(correo == ""){
        continuar = false;
    }
    if(contrasena == ''){
        continuar = false;
    }
    if(contrasena2 == ''){
        continuar = false;
    }    
    if(contrasena2 != contrasena){
        continuar = false;
    }    
    if(nombre == ''){
        continuar = false;
    }
    if(apellido == ''){
        continuar = false;
    }
    if(institucion == ''){
        continuar = false;
    } 
    if(profesor2){
        continuar = false;
    }
    if(continuar){
        const profesor = new Profesor({correo, contrasena, nombre, apellido, institucion});
        await profesor.save();
        console.log('Datos correctos');
        res.redirect('/');
    }else{
        console.log('Datos incorrectos');
        res.redirect('/nuevoProfesor');
    }                 
});

module.exports = router;