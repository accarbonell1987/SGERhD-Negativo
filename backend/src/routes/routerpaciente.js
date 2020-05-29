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
router.get('/paciente', async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: pacientes });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//GET - por id
router.get('/paciente/:id', async (req, res) => {
    try {
        var paciente = await Paciente.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: paciente });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//POST - {json}
router.post('/paciente', async (req, res) => {
    try {
        const { fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones, embarazos, examenes, activo } = req.body;
        const paciente = new Paciente({ fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones,embarazos, examenes, activo });

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
        res.json({ status: 'FAILED', message: err });
    };
    
});

//DELETE - Un paciente por id /paciente/id
router.delete('/paciente/:id', async (req, res) => {
    try {
        const removed = await Paciente.findByIdAndRemove(req.params.id);
        res.json({ status: 'OK', message: 'Eliminado correctamente...', data: removed });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//PATCH - Un paciente por id /paciente/id - {json}
router.patch('/paciente/:id', async (req, res) => {
    try {
        const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones, embarazos, examenes, activo, hijoseliminados } = req.body;
        const paciente = { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones,embarazos, examenes, activo };
        //asignarle el padre o madre al hijo correspondiente
        if (hijos !== null) {
            hijos.map(pacienteid => {
                Paciente.findById(pacienteid)
                .then(hijo => {
                    if (sexo === 'M') hijo.padre = req.params.id;
                    else hijo.madre = req.params.id;
                    const saved = hijo.save();
                });
            });
        }
        if (hijoseliminados !== null) {
            //eliminar el padre o madre al hijo
            hijoseliminados.map(pacienteid => {
                Paciente.findById(pacienteid)
                .then(hijo => {
                    if (sexo === 'M') hijo.padre = null;
                    else hijo.madre = null;
                    const saved = hijo.save();
                });
            });
        }
        await Paciente.findByIdAndUpdate(req.params.id, paciente);
        res.json({ status: 'OK', message: 'Modificado correctamente...', data: paciente });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

module.exports = router;