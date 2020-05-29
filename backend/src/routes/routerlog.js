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
router.get('/log', bll.GetLogs);
//GET - por id
router.get('/log/:id', bll.GetLog);
//POST - {json}
router.post('/log', bll.InsertLog);
//DELETE - por id
router.delete('/log/:id', bll.DeleteLog);
//PATCH - por id - {json}
router.patch('/log/:id', bll.UpdateLog);
//#endregion

//#region Exports
module.exports = router;
//#endregion