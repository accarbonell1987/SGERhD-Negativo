//Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Modelos
const Logs = require('../models/models').logaceso;

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
router.get('/log', async (req, res) => {
    try {
        const logs = await Logs.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: logs });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//GET - por id
router.get('/log/:id', async (req, res) => {
    try {
        const log = await Logs.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: log });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//POST - {json}
router.post('/log', async (req, res) => {
    const { fecha, usuario } = req.body; 
    const log = new Logs({ fecha, usuario });
    
    try {
        const saved = await log.save();
        res.json({ status: 'OK', message: 'Insertado', data: saved });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    };
    
});

//DELETE - por id
router.delete('/log/:id', async (req, res) => {
    try {
        const removed = await Logs.findByIdAndRemove(req.params.id);
        res.json({ status: 'OK', message: 'Eliminado', data: removed });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//PATCH - por id - {json}
router.patch('/log/:id', async (req, res) => {
    try {
        res.json({ status: 'Undefined', message: 'No permitido' });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

module.exports = router;