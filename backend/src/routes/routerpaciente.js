//Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Modelos
const Paciente = require('../models/models').paciente;

//CONSTANTES
const jwtkey = process.env.JWT_KEY;

//JWT Middleware
router.use((req, res, next) => {
    const token = req.headers['Access-Token'];

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
            status: 'FALIED',
            message: 'TOKEN no proveido'
        });
    }
});

//GET - Todos
router.get('/paciente', router, async (req, res) => {
    try {
        const paciente = await Paciente.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: paciente });
    } catch(err) {
        res.json({ message: err });
    }
});

//GET - por id
router.get('/paciente/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: paciente });
    } catch(err) {
        res.json({ message: err });
    }
});

//POST - {json}
router.post('/paciente', async (req, res) => {
    const { nombre, apellidos, ci, direccion, telefono, areaDeSalud, madre, hijos, transfusiones, embarazos, examen } = req.body;
    const paciente = new Paciente({ nombre, apellidos, ci, direccion, telefono, areaDeSalud, madre, hijos, transfusiones, embarazos, examen });

    try {
        await Paciente.findOne({ ci: ci })
            .then(doc => {
                if (doc === null) {
                    const saved = paciente.save();
                    res.json({ status: 'OK', message: 'Insertado correctamente...', data: saved });
                }else{
                    res.json({ status: 'FAILED', message: 'Paciente ya existente...', data: doc });
                }
            }).catch(err => {
                res.json({ status: 'FAILED', message: err });
            });
    } catch(err) {
        res.json({ message: err });
    };
    
});

//DELETE - Un paciente por id /paciente/id
router.delete('/paciente/:id', async (req, res) => {
    try {
        const removed = await Paciente.findByIdAndRemove(req.params.id);
        res.json({ status: 'OK', message: 'Eliminado correctamente...', data: removed });
    } catch(err) {
        res.json({ message: err });
    }
});

//PATCH - Un paciente por id /paciente/id - {json}
router.patch('/paciente/:id', async (req, res) => {
    try {
        const { nombre, apellidos, ci, direccion, telefono, areaDeSalud, madre, hijos, transfusiones, embarazos, examen } = req.body;
        const paciente = new Paciente({ nombre, apellidos, ci, direccion, telefono, areaDeSalud, madre, hijos, transfusiones, embarazos, examen });
        await Paciente.findByIdAndUpdate(req.params.id, paciente);
        res.json({ status: 'OK', message: 'Modificado correctamente...', data: paciente });
    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;