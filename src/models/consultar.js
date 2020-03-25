const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultarSchema = new Schema({
    nombre: String
});

module.exports = mongoose.model('consultar',ConsultarSchema);