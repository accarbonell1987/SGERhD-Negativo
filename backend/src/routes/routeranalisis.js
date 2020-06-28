//#region Requeridos
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
//#endregion

//#region Controladora
var bll = require("../controller/bll");
//#endregion

//#region Constantes
const jwtkey = process.env.JWT_KEY;
//#endregion

//#region Middlewares
router.use((req, res, next) => {
	const token = req.headers["access-token"];

	if (token) {
		jwt.verify(token, jwtkey, (err, decoded) => {
			if (err) {
				return res.status(400).json({ status: 400, message: "Invalid Token" });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(400).json({ status: 400, message: "Not Token" });
	}
});
//#endregion

//#region Rutas
//GET - Todos
router.get("/analisis", bll.GetAnalisis);
//GET - por id
router.get("/analisis/:id", bll.GetOneAnalisis);
//POST - {json}
router.post("/analisis", bll.InsertAnalisis);
//DELETE - Un transfusion por id /transfusion/id
router.delete("/analisis/:id", bll.DeleteAnalisis);
//PUT - lo usaremos para el eliminar
router.put("/analisis/:id", bll.DisableAnalisis);
//PATCH - Un transfusion por id /transfusion/id - {json}
router.patch("/analisis/:id", bll.UpdateAnalisis);
//#endregion

//#region Exports
module.exports = router;
//#endregion
