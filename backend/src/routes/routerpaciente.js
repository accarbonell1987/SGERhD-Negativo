//#region Requeridos
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//#endregion

//#region Controladora
var bll = require('../controller/bll');
//#endregion

//#region Constantes
const jwtkey = process.env.JWT_KEY;
//#endregion

//#region Middlewares
router.use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, jwtkey, (err, decoded) => {
            if (err) {
                return res.status(400).json({ status: 400, message: 'Invalid Token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(400).json({ status: 400, message: 'Not Token'});
    }
});
//#endregion

//#region Rutas
//GET - Todos
router.get('/paciente', bll.GetPatients);
//GET - por id
router.get('/paciente/:id', bll.GetPatient);
//POST - {json}
router.post('/paciente', bll.InsertPatient);
//DELETE - Un paciente por id /paciente/id
router.delete('/paciente/:id', bll.DeletePatient);
//PUT - lo usaremos para el eliminar
router.put('/paciente/:id', bll.DisablePatient);
//PATCH - Un paciente por id /paciente/id - {json}
router.patch('/paciente/:id', bll.UpdatePatient);
//#endregion

//#region Exports
module.exports = router;
//#endregion