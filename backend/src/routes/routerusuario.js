//Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Modelos
const Usuario = require('../models/models').usuario;

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
router.get('/usuario', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: usuarios });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//GET - por id
router.get('/usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: usuario });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//POST - {json}
router.post('/usuario', async (req, res) => {
    const { nombre, contraseña, rol, email, activo } = req.body;
    const usuario = new Usuario({ nombre, contraseña, rol, email, activo });

    try {
        await Usuario.findOne({ nombre: nombre })
            .then(doc => {
                if (doc === null) {
                    const saved = usuario.save();
                    res.json({ status: 'OK', message: 'Insertado correctamente...', data: saved });
                }else{
                    res.json({ status: 'FAILED', message: 'Usuario ya existente...', data: doc });
                }
            }).catch(err => {
                res.json({ status: 'FAILED', message: err });
            });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    };
    
});

//DELETE - Un usuario por id /usuario/id
router.delete('/usuario/:id', async (req, res) => {
    try {
        const removed = await Usuario.findByIdAndRemove(req.params.id);

        res.json({ status: 'OK', message: 'Eliminado correctamente...', data: removed });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//PATCH - Un usuario por id /usuario/id - {json}
router.patch('/usuario/:id', async (req, res) => {
    try {
        const { email, rol, activo } = req.body;
        const data = { email, rol, activo };
        await Usuario.findByIdAndUpdate(req.params.id, data);
        res.json({ status: 'OK', message: 'Modificado correctamente...', data: data });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

//PATCH - Cambiar clave /usuario/id - {json}
router.patch('/usuario/password/:id', async (req, res) => {
    try {
        const { contraseña } = req.body;
        const data = { contraseña };
        await Usuario.findByIdAndUpdate(req.params.id, data);
        res.json({ status: 'OK', message: 'Contraseña cambiada correctamente...', data: data });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    }
});

module.exports = router;