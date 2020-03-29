const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchivosInstrumentosShema = new Schema({
    idInstrumento:String,
    nombreArchivo:String
    //rutaArchivo:String
});

module.exports = mongoose.model('archicosinstrumentos',ArchivosInstrumentosShema);