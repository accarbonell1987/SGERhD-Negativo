var http = require('http');

var manejador = function(req, res) {
    console.log('Hola mundele');
    res.end();
};

var servidor = http.createServer(manejador);
servidor.listen(8000);