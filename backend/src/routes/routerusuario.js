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
//#endregion

//#region Rutas
//GET - Todos
router.get('/usuario', bll.GetUsers);
//GET - por id
router.get('/usuario/:id', bll.GetUser);
//POST - {json}
router.post('/usuario', bll.InsertUser);
//DELETE - Un usuario por id /usuario/id
router.delete('/usuario/:id', bll.DeleteUser);
//PATCH - Un usuario por id /usuario/id - {json}
router.patch('/usuario/:id', bll.UpdateUser);
//PATCH - Cambiar clave /usuario/id - {json}
router.patch('/usuario/password/:id', bll.UpdateUserPassword);
//#endregion

//#region Exports
module.exports = router;
//#endregion