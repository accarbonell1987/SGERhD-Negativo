//requeridos
var express = require('express');

//definir el obj Router
var router = express.Router();

router.get('/', function(req, res) {
    res.render('app/home')
});

module.exports = router;