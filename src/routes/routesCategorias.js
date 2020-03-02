const express = require('express');
const router = express.Router();
const Nivel_dificultad = require('../models/nivel_dificultad');
const Categoria = require('../models/categoria');
const Tiempo_duracion = require('../models/tiempo_duracion');


router.get('/nuevaCategoria', async (req, res) => {
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
    res.render('nuevaCategoria', {categorias});
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