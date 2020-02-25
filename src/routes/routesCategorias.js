const express = require('express');
const router = express.Router();

const Categoria = require('../models/categoria');

router.get('/nuevaCategoria', async (req, res) => {
    const categorias = await Categoria.find();
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