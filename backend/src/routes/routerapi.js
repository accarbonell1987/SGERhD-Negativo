//Requeridos
const express = require('express');
const router = express.Router();

//Rutas
router.get('/', function(req, res) {
    res.json({
        status: 'API WORK!'
    });
});

module.exports = router;