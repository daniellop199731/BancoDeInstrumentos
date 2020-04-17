const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropositosSchema = new Schema({
    nombre: String
});

module.exports = mongoose.model('propositos',PropositosSchema);