const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TiempoDuracionSchema = new Schema({
    nombre: String
});

module.exports = mongoose.model('TiempoDuracion',TiempoDuracionSchema);