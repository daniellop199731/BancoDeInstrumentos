const express = require('express');
const router = express.Router();

const Categoria = require('../models/categoria');
const Sesion = require('../models/sesion');
const Profesor = require('../models/profesor');

router.get('/nuevaCategoria', async (req, res) => {

    //APLICA SESION
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if(sesionActual.length == 1){
        console.log(sesionActual[0].correo);
        profesor = await Profesor.find({correo: sesionActual[0].correo});
        console.log(profesor);
        haySesion = true;
    }  

    const categorias = await Categoria.find();
   // const tiempoduracion = new Tiempo_duracion({nombre:'10 min'});
   // const tiempoduracion1 = new Tiempo_duracion({nombre:'20 min'});
   // const tiempoduracion2 = new Tiempo_duracion({nombre:'30 min'});
   // await tiempoduracion.save();
   // await tiempoduracion1.save();
   // await tiempoduracion2.save();

   // const niveldificultad = new Nivel_dificultad({nombre:'Alto'});
   // const niveldificultad1 = new Nivel_dificultad({nombre:'Medio'});
   // const niveldificultad2 = new Nivel_dificultad({nombre:'Bajo'});
   // await niveldificultad.save();
   // await niveldificultad1.save();
   // await niveldificultad2.save();

    res.render('nuevaCategoria', {categorias, profesor});
});

router.post('/guardarCategoria', async (req, res)=>{
    const {nombre} = req.body;
    var continuar = true;
    if(nombre == ''){
        continuar = false;
    }
    if(continuar){
        const categoria = new Categoria(req.body);
        await categoria.save();
        res.redirect('/nuevaCategoria');
    }else{        
        console.log('Faltan Datos En El Formulario');
        res.redirect('/nuevaCategoria');
    }
});

module.exports = router;