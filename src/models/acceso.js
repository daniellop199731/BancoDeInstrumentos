const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccesoSchema = new Schema({
    correo: String,
    codAcceso: String
});

module.exports = mongoose.model('accesos',AccesoSchema);