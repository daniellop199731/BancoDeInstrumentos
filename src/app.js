//SOLO CON ESTO ES UN SERVIDOR EN BLANCO////////////////////////////////////
const path = require('path'); //Enlazador de direcciones
const express = require('express'); //Se importa express
const app = express(); //Inicializacion de express (apliccion de servidor)  
const morgan = require('morgan'); //Info de peticiones por consola
const mongoose = require('mongoose'); //Conexion entre express y mongo db

//Asignacion del puerto
//const port = 8080;

//Inicialisacion del servidor (MUY BASICO) ()
/*app.listen(port, () =>{
    console.log('Server listening on port ' + port);
});*/
/////////////////////////////////////////////////////////////////////////////

//Base de datos
mongoose.connect('mongodb://localhost/pruena-instrumentos')
    .then(db => console.log('DB connected'))
    .catch(err => console.log('ERROR ------> ' + err));

//Importar rutas
//app.use(require('./routes/index'));
//app.use(require('./routes/routesInstrumentos'));
//app.use(require('./routes/routesCategorias'));
//const indexRoutes = require('./routes/index');
//const intrumentoRoutes = require('./routes/routesInstrumentos');

//Configuracion
app.set('port', process.env.PORT || 3000); //Use puerto asignado por el SO, si no hay use el 8080
app.set('views', path.join(__dirname, 'views')); //Carpetas de las vistas
app.set('view engine', 'ejs'); //Motor de plantillas

//Middlewares (express)
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//Rutas
//app.use('/', indexRoutes);
app.use(require('./routes/index'));
app.use(require('./routes/routesInstrumentos'));
app.use(require('./routes/routesCategorias'));
app.use(require('./routes/routesProfesores'));
app.use(require('./routes/routesSession'));
app.use(require('./routes/consultar'));



//Fecha de arranque
let now = new Date();

//Inicialisacion del servidor
app.listen(app.get('port'), () =>{
    console.log('Server listening on port ' + app.get('port'));
    console.log(now);
});