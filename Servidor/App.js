import { createServer } from 'http';

var manejador = function(req, res) {
    console.log('Hola mundele');
    res.end();
};

var servidor = createServer(manejador);
servidor.listen(8000);