const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    correo: String,
    fecha: String
});

module.exports = mongoose.model('session', SessionSchema);