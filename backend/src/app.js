//Requeridos
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

// var session_middleware = require('./middlewares/sessions');

var app = express();

//Settings
app.set('port', process.env.PORT || 4000); //en caso que exista un puerto definido se usa sino, uso 3000
app.set('json spaces', 2);

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(bodyParser.json()); //para la peticion json/body
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/app', router_app);
// app.use('/app', session_middleware);

//Routes
app.use('/api', require('./routes/routerapi'));
app.use('/api', require('./routes/routerseguridad'));
app.use('/api', require('./routes/routerusuario'));
app.use('/api', require('./routes/routerlog'));
app.use('/api', require('./routes/routerpaciente'));
app.use('/api', require('./routes/routerhistoriaclinica'));
app.use('/api', require('./routes/routerembarazo'));
app.use('/api', require('./routes/routertransfusion'));

//Static files
console.log(__dirname);

//starting server
app.listen(app.get('port'), () => {
    console.log('Servidor Iniciado: http://localhost:'+app.get('port'));
});