const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NivelDificultadSchema = new Schema({
    nombre: String
});

module.exports = mongoose.model('NivelDificultad',NivelDificultadSchema);