//ELEMENTOS REQUERIDOS
const express = require('express'); //MODULO EXPRESS SERVIDOR
const router = express.Router(); //MODULO PARA CREACION DE RURAS

const path = require('path'); //MODULO PARA LA LA GESTION DE RURAS DE DIRECTORIOS
const multer = require('multer'); //MODULO PARA LA GESTION DE ARCHIVOS
const storage = multer.diskStorage({ // CONFIGURACION DEL PROCESO DE ARCHIVOS
    destination: path.join(__dirname, '../public/arvhivos'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const cargaArchivos = multer({ // CONFIGURACION DEL ALMACENAMIENTO DE ARCHIVOS
    storage: storage,
    dest: path.join(__dirname, '../public/arvhivos')
}).single('archivo')

const cargaArchivos2 = multer({ // CONFIGURACION DEL ALMACENAMIENTO DE ARCHIVOS
    storage: storage,
    dest: path.join(__dirname, '../public/arvhivos')
}).single('archivo2')
//ELEMENTOS REQUERIDOS

//MODELO PRINCIPAL DE DATOS
const Instrumento = require('../models/instrumento');
const consultar = require('../models/categoria');
//Modelos auxiliares
const Categoria = require('../models/categoria');
const NivelDificultad = require('../models/nivel_dificultad');
const TiempoDuracion = require('../models/tiempo_duracion');
const ArchivoInstrimentos = require('../models/archivosInstrumentos');
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

router.post('/crearInstrumento', cargaArchivos, async (req, res) => {
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
        var nombreArchivo = req.file.originalname;
        var idInstrumento = instrumento.id;
        const archivoInstrumento = new ArchivoInstrimentos({idInstrumento, nombreArchivo});
        await archivoInstrumento.save();
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

/*router.get('/consultar', async (req, res) => {
    const categorias = await Categoria.find();
    const sesionActual = await Sesion.find().limit(1);
    const instrumentos = null;
    var profesor = null;
    if (sesionActual.length == 1) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual.correo });
        haySesion = true;
    }
    res.render('index', { profesor, categorias, instrumentos });
});*/

router.get('/consultar', async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if (sesionActual.length == 1) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual.correo });
        haySesion = true;
    }
    const { categoria } = req.body;
    var filtro = new RegExp(categoria, 'i');
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find({
        $or: [
            { 'categoria': filtro },
            { 'conceptos': filtro }
        ], publicado: 1
    });
    res.render('consultar', { profesor, categorias, instrumentos });

});

router.post('/consultar', async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if (sesionActual.length == 1) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual.correo });
        haySesion = true;
    }
    const { categoria } = req.body;
    var filtro = new RegExp(categoria, 'i');
    const categorias = await Categoria.find();
    const instrumentos = await Instrumento.find({
        $or: [
            { 'categoria': filtro },
            { 'conceptos': filtro }
        ], publicado: 1
    });
    res.render('consultar', { profesor, categorias, instrumentos });
});

router.post('/archivosInstrumento', async (req, res)=>{
    var profesor = null;
    const idInst = req.body.idInst;
    const sesionActual = await Sesion.find().limit(1);
    const instrumento = await Instrumento.findById(idInst);
    if (sesionActual.length == 1) {
        //console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual.correo });
        haySesion = true;
    }
    
    //console.log(idInst);
    const archivosInstrumento = await ArchivoInstrimentos.find({idInstrumento: '5e8109f3ad2cec31cc174a63'});
    //const archivosInstrumento = await ArchivoInstrimentos.find({idInstrumento: idInst+""});
    //console.log(archivosInstrumento);
    res.render('archivosInstrumento', {archivosInstrumento, idInst, profesor, instrumento});
});

router.post('/agregarArchivoInstrumento', cargaArchivos2, async (req, res)=>{    
    
    var idInstrumento = req.body.idInst;
    console.log(idInstrumento);
    var nombreArchivo = req.body.archivo2;
    const archivoInstrumento = new ArchivoInstrimentos({idInstrumento, nombreArchivo});
    await archivoInstrumento.save();
    res.redirect('/consultar');
    //res.send(archivoInstrumento);
});

router.post('/eliminarArchivoInstrumento', cargaArchivos2, async (req, res)=>{ 
    const idArchivoInstrumento = req.body.idArchivoInstrumento;
    await ArchivoInstrimentos.findByIdAndDelete(idArchivoInstrumento);
    res.redirect('/consultar');
});

module.exports = router;