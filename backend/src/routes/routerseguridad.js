//#region Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//#endregion

//#region Modelos
const Usuario = require('../models/models').usuario;
//#endregion

//#region Services
var LogServices = require('../services/logs');
//#endregion

//#region Constantes
const jwtkey = process.env.JWT_KEY;
//#endregion

//#region Rutas
//POST - {json}
router.post('/seguridad/autenticar', async (req, res) => {
    try {
        await Usuario.findOne({ nombre: req.body.nombre, contraseña: req.body.contraseña})
            .then(user => {
                if (user === null) res.status(400).json({ status: 400, message: 'Usuario o contraseña incorrecto', data: user });
                else {
                    const payload = { check: true };
                    const token = jwt.sign(payload, jwtkey, { expiresIn: 1440 });
                    LogServices.InsertLog({fecha: Date.now(), usuario: user._id });
                    res.status(200).json({ status: 200, message: 'Autenticado', data: user, token: token });
                }
            })
            .catch(err => {
                res.status(400).json({ status: 400, message: err });
            });
    } catch(err) {
        res.status(400).json({ status: 400, message: err });
    };
});
//#endregion

//#region Exports
module.exports = router;
//#endregion