const express = require('express');
const router = express.Router();

const Sesion = require('../models/sesion');
const Profesor = require('../models/profesor');
const Acceso = require('../models/acceso');

router.get('/nuevoProfesor',  async (req, res) => {
    const mensaje = null;
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if(sesionActual.length == 1){
        console.log(sesionActual);
        profesor = await Profesor.find({correo: sesionActual.correo});
    }
    res.render('nuevoProfesor', {profesor,mensaje});
});

router.get('/nuevoProfesorMsg',  async (req, res) => {
    const mensaje = 'Contáctece con el administrador para obtener un codigo de acceso.'
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if(sesionActual.length == 1){
        console.log(sesionActual);
        profesor = await Profesor.find({correo: sesionActual.correo});
    }
    res.render('nuevoProfesor', {profesor, mensaje});
});

router.post('/crearProfesor', async (req, res) => {
    const {correo, contrasena, contrasena2, nombre, apellido, institucion, codAcceso} = req.body;
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
    if(codAcceso == ''){
        continuar = false;
    }
    if(continuar){
        var acceso = null;
        acceso = await Acceso.find({$and:[{correo:correo},{codAcceso:codAcceso}]});
        if(acceso != ""){
            var esAdmin = "0";
            const profesor = new Profesor({correo, contrasena, nombre, apellido, institucion, esAdmin});
            await profesor.save();
            await Acceso.deleteOne({$and:[{correo:correo},{codAcceso:codAcceso}]});
            console.log('Datos correctos');
            res.redirect('/msg');
        }else{
            console.log('Datos incorrectos');
            res.redirect('/nuevoProfesorMsg');
        }
    }else{
        console.log('Datos incorrectos');
        res.redirect('/nuevoProfesor');
    }                 
});

router.get('/nuevoAcceso',  async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
    const accesos = await Acceso.find();
    var profesor = null;
    if(sesionActual.length == 1){
        console.log(sesionActual);
        profesor = await Profesor.find({correo: sesionActual[0].correo});
    }
    res.render('nuevoAcceso', {profesor, accesos});
});

router.post('/crearAcceso', async (req, res) => {
    const {correo} = req.body;
    var acceso = null;
    var continuar = true;
    var d1 = null;
    var d2 = null;
    var d3 = null;
    var d4 = null;
    var codAcceso = null;    
    if(correo == ""){
        continuar = false;
    }
    if(continuar){
        acceso = await Acceso.find({correo: correo});
        if(acceso == ""){       
            console.log('ALMENOS ENTRA ' + acceso);     
            while(acceso == ""){
                d1 = Math.floor(Math.random() * (9 - 0)) + 0;
                d2 = Math.floor(Math.random() * (9 - 0)) + 0;
                d3 = Math.floor(Math.random() * (9 - 0)) + 0;
                d4 = Math.floor(Math.random() * (9 - 0)) + 0;
                codAcceso = d1 + "" + d2 + "" + d3 + "" + d4
                acceso = await Acceso.find({codAcceso: codAcceso});
                if(acceso == ""){
                    acceso = new Acceso({correo, codAcceso});
                    await acceso.save();
                    console.log(acceso);
                    console.log('Datos correctos');
                    res.redirect('/nuevoAcceso');
                }
            }
        }else{
            res.redirect('/nuevoAcceso');
        }
    }else{
        console.log('Datos incorrectos');
        res.redirect('/nuevoAcceso');
    }                 
});

router.get('/eliminarAcceso', async (req, res) => {
    const id = req.query.idCod;
    await Acceso.deleteOne({ _id: id });
    res.redirect('/nuevoAcceso');

    //instrumento.findOneAndRemove({_id: req.params.id},function(error){

      //  if(!error){
      //      res.redirect('/nuevoInstrumento')
      //  }else{
      //      console.log(error)
      //      res.redirect('/nuevoInstrumento')
       // }
    //})
});

module.exports = router;