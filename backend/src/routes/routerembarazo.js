//Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Modelos
const Embarazo = require('../models/models').embarazo;

//CONSTANTES
const jwtkey = process.env.JWT_KEY;

//JWT Middleware
router.use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, jwtkey, (err, decoded) => {
            if (err) {
                return res.json({ status: 'FAILED', message: 'TOKEN invalida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            status: 'FAILED',
            message: 'TOKEN no proveido'
        });
    }
});

//GET - Todos
router.get('/embarazo', async (req, res) => {
    try {
        const embarazos = await embarazo.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: embarazos });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//GET - por id
router.get('/embarazo/:id', async (req, res) => {
    try {
        const embarazo = await embarazo.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: embarazo });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//POST - {json}
router.post('/embarazo', async (req, res) => {
    try {
        const { fecha, tiempoDeGestacion, observaciones, examenes, tipos, findeembarazo, findeaborto, findeparto, paciente, activo } = req.body;
        const embarazo = new embarazo({ fecha, tiempoDeGestacion, observaciones, examenes, tipos, findeembarazo, findeaborto, findeparto, paciente, activo });
        const saved = embarazo.save();
        res.json({ status: 'OK', message: 'Insertado correctamente...', data: saved });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    };
    
});

//DELETE - Un embarazo por id /embarazo/id
router.delete('/embarazo/:id', async (req, res) => {
    try {
        const removed = await embarazo.findByIdAndRemove(req.params.id);
        res.json({ status: 'OK', message: 'Eliminado correctamente...', data: removed });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//PATCH - Un embarazo por id /embarazo/id - {json}
router.patch('/embarazo/:id', async (req, res) => {
    try {
        const { fecha, tiempoDeGestacion, observaciones, examenes, tipos, findeembarazo, findeaborto, findeparto, paciente, activo } = req.body;
        const embarazo = { fecha, tiempoDeGestacion, observaciones, examenes, tipos, findeembarazo, findeaborto, findeparto, paciente, activo };
        
        await embarazo.findByIdAndUpdate(req.params.id, embarazo);
        res.json({ status: 'OK', message: 'Modificado correctamente...', data: embarazo });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

module.exports = router;