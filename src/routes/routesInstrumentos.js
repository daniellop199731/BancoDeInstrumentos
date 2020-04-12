//ELEMENTOS REQUERIDOS
const express = require('express'); //MODULO EXPRESS SERVIDOR
const router = express.Router(); //MODULO PARA CREACION DE RURAS

const path = require('path'); //MODULO PARA LA LA GESTION DE RURAS DE DIRECTORIOS
const multer = require('multer'); //MODULO PARA LA GESTION DE ARCHIVOS
const storage = multer.diskStorage({ // CONFIGURACION DEL PROCESO DE ARCHIVOS
    destination: path.join(__dirname, '../public/archivos'),
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/ /g, "_"));
    }
});
const cargaArchivos = multer({ // CONFIGURACION DEL ALMACENAMIENTO DE ARCHIVOS
    storage: storage,
    dest: path.join(__dirname, '../public/archivos')
}).single('archivo')




//ELEMENTOS REQUERIDOS

//MODELO PRINCIPAL DE DATOS
const Instrumento = require('../models/instrumento');;
const consultar = require('../models/categoria');
//Modelos auxiliares
const Categoria = require('../models/categoria');
const NivelDificultad = require('../models/nivel_dificultad');
const TiempoDuracion = require('../models/tiempo_duracion');
const ArchivoInstrimentos = require('../models/archivosInstrumentos');
const ComentarioInstrumento = require('../models/comentariosInstrumentos');
//Para control de sesion
const Sesion = require('../models/sesion');
const Profesor = require('../models/profesor');
//Para descargar un archivo
const randomstring = require("randomstring");
//const express = require('express');
const pdf = require('html-pdf');
const fs = require('fs');
//const router = express.Router();

//Borrar si no sirve
//const instrumentos = require('../models/instrumento')

router.get('/nuevoInstrumento', async (req, res) => {

    //APLICA SESION
    const sesionActual = await Sesion.find().limit(1);
    var haySesion = false;
    var profesor = null;
    if(sesionActual.length > 0){
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
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
        const instrumentos = await Instrumento.find({ correoAutor: profesor[0].correo });
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
        var nombreArchivo = req.file.originalname.replace(/ /g, "_");
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
    if(sesionActual.length > 0){
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
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
    if(instrumento.publicado > 0){
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
    if (sesionActual.length > 0) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
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
    for (let i = 0; i < instrumentos.length; i++) {
        instrumentos[i].base64 = await generarBase64(instrumentos[i]);
        instrumentos[i].archivos = await obtenerArchivos(instrumentos[i]._id)
    }
    res.render('consultar', { profesor, categorias, instrumentos });

});

router.post('/consultar', async (req, res) => {
    const sesionActual = await Sesion.find().limit(1);
    var profesor = null;
    if (sesionActual.length > 0) {
        console.log(sesionActual);
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
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
    for (let i = 0; i < instrumentos.length; i++) {
        instrumentos[i].base64 = await generarBase64(instrumentos[i]);
        instrumentos[i].archivos = await obtenerArchivos(instrumentos[i]._id)
    }
    res.render('consultar', { profesor, categorias, instrumentos });
});

function generarBase64(instrumento, callback) {
    return new Promise(callback => {
        var contenido = `
        <h1>Instrumento</h1>
        <p><b>Nombre</b>:<br> ${instrumento.nombre}
        <p><b>Descripcion</b>:<br> ${instrumento.descripcion}
        <p><b>Categoria</b>:<br> ${instrumento.categoria}
        <p><b>Objetivos</b>:<br> ${instrumento.objetivos}
        <p><b>Proposito</b>:<br> ${instrumento.proposito}
        <p><b>Tiempo de duración</b>:<br> ${instrumento.t_Duracion}
        <p><b>Nivel de dificultad</b>:<br> ${instrumento.n_Dificultad}
        <p><b>Material</b>:<br> ${instrumento.material}
        <p><b>Reglas</b>:<br> ${instrumento.reglas}
        <p><b>Conceptos</b>:<br> ${instrumento.conceptos}
        <p><b>Numero de integrantes</b>:<br> ${instrumento.numeroIntegrantes}
        <p><b>Archivos adjuntos</b>:<br> ${instrumento.archivoInstrumento}
        <p><b>Correo autor</b>:<br> ${instrumento.correoAutor}
        <p><b>Publicado</b>:<br> ${instrumento.publicado > 0 ? "Si" : "No"}</p>`;

        pdf.create(contenido).toBuffer(function (err, buffer) {
            if (err) {
                console.log("Ha ocurrido un error");
                callback(null)
            } else {
                var respuesta = `data:application/pdf;base64,` + buffer.toString('base64');
                callback(respuesta)
            }
        });
    });
}

async function obtenerArchivos(idInst) {
    const archivosInstrumento = await ArchivoInstrimentos.find({ idInstrumento: idInst });
    console.log(idInst);
    var respuesta = ''
    for (let i = 0; i < archivosInstrumento.length; i++) {
        var nombre = archivosInstrumento[i].nombreArchivo
        var file = await fs.readFileSync(`src/public/archivos/${nombre}`);
        respuesta = respuesta + `${nombre}|split|data:@file/file;base64,` + file.toString('base64') + "|name|";
    }
    
    return respuesta
}

router.post('/agregarComentarioInstrumento', async (req, res) => {

    const idInstrumento = req.body.idInst;
    const comentario = req.body.comentario;

    var profesor = null;
    const sesionActual = await Sesion.find().limit(1);
    const idInst = idInstrumento
    const instrumento = await Instrumento.findById(idInst);
    const autor = sesionActual[0].correo || "No establecido"
    if (sesionActual.length > 0) {
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
    }
    let fecha = new Date().toLocaleString();
    const comentarioInstrumento = new ComentarioInstrumento({ idInstrumento, comentario, autor, fecha });
    await comentarioInstrumento.save();
    const comentariosInstrumentos = await ComentarioInstrumento.find({ idInstrumento: idInst });
    res.render('verComentarioInstrumento', { comentariosInstrumentos, idInst, profesor, instrumento });
});

router.post('/verComentarioInstrumento', async (req, res) => {
    var profesor = null;
    const idInst = req.body.idInst;
    const sesionActual = await Sesion.find().limit(1);
    const instrumento = await Instrumento.findById(idInst);
    if (sesionActual.length > 0) {
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
        haySesion = true;
    }
    const comentariosInstrumentos = await ComentarioInstrumento.find({ idInstrumento: idInst });
    res.render('verComentarioInstrumento', { comentariosInstrumentos, idInst, profesor, instrumento });
});

router.post('/archivosInstrumento', async (req, res)=>{

    var profesor = null;
    const idInst = req.body.idInst;
    const sesionActual = await Sesion.find().limit(1);
    const instrumento = await Instrumento.findById(idInst);
    if (sesionActual.length > 0) {
        profesor = await Profesor.find({ correo: sesionActual[0].correo });
        haySesion = true;
    }
    const archivosInstrumento = await ArchivoInstrimentos.find({idInstrumento: idInst});
    res.render('archivosInstrumento', {archivosInstrumento, idInst, profesor, instrumento});
});

router.post('/agregarArchivoInstrumento', cargaArchivos, async (req, res)=>{    
    var idInstrumento = req.body.idInst;
    var nombreArchivo = req.file.originalname.replace(/ /g, "_");
    const archivoInstrumento = new ArchivoInstrimentos({idInstrumento, nombreArchivo});
    await archivoInstrumento.save();
    res.redirect('/consultar');
});

router.post('/eliminarArchivoInstrumento', async (req, res)=>{ 
    const idArchivoInstrumento = req.body.idArchivoInstrumento;
    await ArchivoInstrimentos.findByIdAndDelete(idArchivoInstrumento);
    res.redirect('/consultar');
});

module.exports = router;