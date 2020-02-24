const express = require('express');
const router = express.Router();

const Categoria = require('../models/categoria');

router.get('/nuevaCategoria', async (req, res) => {
    const categorias = await Categoria.find();
    res.render('nuevaCategoria', {categorias});
});

router.post('/guardarCategoria', async (req, res)=>{
    const nombre = req.body;
    var continuar = true;
    if(nombre == ''){
        continuar = false;
    }
    if(continuar){
        const categoria = new Categoria(req.body);
        await categoria.save();
        const categorias = await Categoria.find();
        res.render('nuevaCategoria', {categorias});
    }else{
        const categorias = await Categoria.find();
        console.log('Faltan Datos En El Formulario');
        res.render('nuevaCategoria', {categorias});
    }
    //res.send('Categoria insertada');
});

module.exports = router;