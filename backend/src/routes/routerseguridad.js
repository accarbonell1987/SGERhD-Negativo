//Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Modelos
const Usuario = require('../models/models').usuario;
const Log = require('../models/models').logaceso;

const jwtkey = process.env.JWT_KEY;

//POST - {json}
router.post('/seguridad/autenticar', async (req, res) => {
    try {
        var autenticado = false;

        await Usuario.findOne({ nombre: req.body.nombre, contraseña: req.body.contraseña})
            .then(doc => {
                if (doc === null) res.json({ status: 'FAILED', message: 'Usuario o contraseña incorrecto', data: doc });
                else {
                    const payload = { check: true };
                    const token = jwt.sign(payload, jwtkey, { expiresIn: 1440 });

                    //salvando el log cada vez que me autentico
                    const log = new Log({fecha: Date.now(), usuario: doc._id });
                    log.save();

                    res.json({ status: 'OK', message: 'Autenticado', data: doc, token: token });
                }
            })
            .catch(err => {
                res.json({ status: 'FAILED', message: err });
            });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    };
});

module.exports = router;