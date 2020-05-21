//Requeridos
const express = require('express');
const router = express.Router();

//Modelos
const Logs = require('../models/models').logaceso;

//Rutas
//GET - Todos
router.get('/log', async (req, res) => {
    try {
        const logs = await Logs.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: logs });
    } catch(err) {
        res.json({ message: err });
    }
});

//GET - por id
router.get('/log/:id', async (req, res) => {
    try {
        const log = await Logs.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: log });
    } catch(err) {
        res.json({ message: err });
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
        res.json({ message: err });
    };
    
});

//DELETE - por id
router.delete('/log/:id', async (req, res) => {
    try {
        const removed = await Logs.findByIdAndRemove(req.params.id);
        res.json({ status: 'OK', message: 'Eliminado', data: removed });
    } catch(err) {
        res.json({ message: err });
    }
});

//PATCH - por id - {json}
router.patch('/log/:id', async (req, res) => {
    try {
        res.json({ status: 'Undefined', message: 'No permitido' });
    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;