const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComentariosInstrumentosSchema = new Schema({
    idInstrumento: String,
    comentario: String,
    autor: String,
    fecha: String
});

module.exports = mongoose.model('comentariosinstrumentos', ComentariosInstrumentosSchema);