const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstrumentoSchema = new Schema({
    nombre: String,
    descripcion: String,
    categoria: String,
    objetivos: Array,
    proposito: Array,
    t_Duracion: String,
    n_Dificultad: String,
    material: String,
    reglas: Array,
    conceptos: Array,
    numeroIntegrantes: String,
    correoAutor: String,
    publicado: Number
});

module.exports = mongoose.model('instrumentos',InstrumentoSchema);