const express = require('express');
const router = express.Router();

const Profesor = require('../models/profesor');
const Sesion = require('../models/sesion');

router.get('/login', async (req, res) =>{
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if(sesionActual.length == 1){
        console.log(sesionActual);
        profesor = await Profesor.find({correo: sesionActual.correo});
    }
    res.render('session', {profesor});
});

router.post('/inicioSesion', async (req, res) =>{
    const {correo, contrasena} = req.body;
    const profesor = await Profesor.findOne({correo: correo});
    if(profesor.contrasena == contrasena){
        console.log('Iniciar sesion');
        const sesion = new Sesion({correo});
        await sesion.save();
        res.redirect('/nuevoInstrumento');
    }else{
        console.log('Contraseña incorrecta');
        res.redirect('/login');
    }
});

router.get('/salirSesion', async (req, res) => {
    await Sesion.remove();
    res.redirect('/');
});

module.exports = router;