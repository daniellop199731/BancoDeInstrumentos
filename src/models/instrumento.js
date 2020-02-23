const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstrumentoSchema = new Schema({
    nombre: String,
    descripcion: String,
    categoria: String,
    objetivos: String,
    proposito: String,
    t_Duracion: String,
    n_Dificultad: String
});

module.exports = mongoose.model('instrumentos',InstrumentoSchema);