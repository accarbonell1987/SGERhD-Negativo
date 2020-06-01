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
router.get('/historiaclinica', bll.GetClinicsHistory);
//GET - por id
router.get('/historiaclinica/:id', bll.GetClinicHistory);
//GET - ultimo insertado
// router.get('/historiaclinica/ultimo', bll.GetClinicHistoryLastInserted);
//POST - {json}
router.post('/historiaclinica', bll.InsertClinicHistory);
//DELETE - Una historiaclinica por id
router.delete('/historiaclinica/:id', bll.DeleteClinicHistory);
//PATCH - Un historiaclinica por id {json}
router.patch('/historiaclinica/:id', bll.UpdateClinicHistory);
//#endregion

//#region Exports
module.exports = router;
//#endregion