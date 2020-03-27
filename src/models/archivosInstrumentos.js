const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchivosInstrumentosShema = new Schema({
    nombreArchivo:String
});

module.exports = mongoose.model('archicosInstrumentos',ArchivosInstrumentosShema);