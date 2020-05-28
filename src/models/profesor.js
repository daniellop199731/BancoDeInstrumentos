const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfesorSchema = new Schema({
    correo: String,
    contrasena: String,
    nombre: String,
    apellido: String,    
    institucion: String,
    esAdmin: String
});

module.exports = mongoose.model('profesores', ProfesorSchema);