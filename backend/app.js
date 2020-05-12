//requeridos
var express = require('express');
var bodyParser = require('body-parser');
var router_app = require('./routes/routers_app');
var session_middleware = require('./middlewares/sessions');

var app = express();

//uses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/app', router_app);
app.use('/app', session_middleware);