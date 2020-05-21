//Requeridos
const express = require('express');
const router = express.Router();

//Modelos
const Usuario = require('../models/models').usuario;

//Rutas
//GET - Todos
router.get('/usuario', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json({
            status: 'OK',
            message: 'Obtenidos',
            data: usuario
        });
    } catch(err) {
        res.json({ message: err });
    }
});

//GET - por id
router.get('/usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        res.json({
            status: 'OK',
            message: 'Obtenido',
            data: usuario
        });
    } catch(err) {
        res.json({ message: err });
    }
});

//POST - {json}
router.post('/usuario', async (req, res) => {
    const { nombre, contraseña, rol } = req.body;
    const usuario = new Usuario({ nombre, contraseña, rol });

    try {
        const saved = await usuario.save();
        res.json({
            status: 'OK',
            message: 'Insertado',
            data: saved
        });
    } catch(err) {
        res.json({ message: err });
    };
    
});

//POST - {json}
router.post('/usuario/autenticar', async (req, res) => {
    try {
        await Usuario.findOne({ nombre: req.body.nombre, contraseña: req.body.contraseña}, 
            (err, doc) => {
                res.json({ 
                    status: 'OK',
                    message: 'Autenticado'
                })
            }
        );
    } catch(err) {
        res.json({ message: err });
    };
});

//DELETE - Un usuario por id /usuario/id
router.delete('/usuario/:id', async (req, res) => {
    try {
        const removed = await Usuario.findByIdAndRemove(req.params.id);

        res.json({ 
            status: 'OK',
            message: 'Eliminado',
            data: removed
        });
    } catch(err) {
        res.json({ message: err });
    }
});

//PATCH - Un usuario por id /usuario/id - {json}
router.patch('/usuario/:id', async (req, res) => {
    try {
        const { nombre, contraseña, rol } = req.body;
        const data = { nombre, contraseña, rol };
        await Usuario.findByIdAndUpdate(req.params.id, data);
        res.json({ 
            status: 'OK',
            message: 'Modificado',
            data: data
        });
    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;