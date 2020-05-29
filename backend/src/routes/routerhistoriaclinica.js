//Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Modelos
const HistoriaClinica = require('../models/models').historiaclinica;
const Paciente = require('../models/models').paciente;

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
router.get('/historiaclinica', async (req, res) => {
    try {
        const historiasclinica = await HistoriaClinica.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: historiasclinica });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//GET - ultimo insertado
router.get('/historiaclinica/ultimo', async (req, res) => {
    try {
        HistoriaClinica.find()
        .sort({ _id: -1})
        .limit(1)
        .then(data => {
            res.json({ status: 'OK', message: 'Obtenido', data: data });
        });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//GET - por id
router.get('/historiaclinica/:id', async (req, res) => {
    try {
        const historiaclinica = await HistoriaClinica.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: historiaclinica });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//POST - {json}
router.post('/historiaclinica', async (req, res) => {
    try {
        const { fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = req.body;
        const historiaclinica = new HistoriaClinica({ fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo });
        await HistoriaClinica.findOne({ paciente: paciente })
            .then(doc => {
                if (doc === null) {
                    const saved = historiaclinica.save();
                    res.json({ status: 'OK', message: 'Insertado correctamente...', data: saved });
                }else{
                    res.json({ status: 'FAILED', message: 'HistoriaClinica ya existente...', data: doc });
                }
            }).catch(err => {
                res.json({ status: 'FAILED', message: err });
            });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    };
    
});

//DELETE - Un historiaclinica por id /historiaclinica/id
router.delete('/historiaclinica/:id', async (req, res) => {
    try {
        const removed = await HistoriaClinica.findByIdAndRemove(req.params.id);
        res.json({ status: 'OK', message: 'Eliminado correctamente...', data: removed });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//PATCH - Un historiaclinica por id /historiaclinica/id - {json}
router.patch('/historiaclinica/:id', async (req, res) => {
    try {
        const { fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = req.body;
        const historiaclinica = { fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo };
        await HistoriaClinica.findByIdAndUpdate(req.params.id, historiaclinica);
        res.json({ status: 'OK', message: 'Modificado correctamente...', data: historiaclinica });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

module.exports = router;