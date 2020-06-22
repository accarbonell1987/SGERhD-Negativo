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
router.get("/examen", bll.GetTests);
//GET - por id
router.get("/examen/:id", bll.GetTest);
//POST - {json}
router.post("/examen", bll.InsertTest);
//DELETE - Un transfusion por id /transfusion/id
router.delete("/examen/:id", bll.DeleteTest);
//PUT - lo usaremos para el eliminar
router.put("/examen/:id", bll.DisableTest);
//PATCH - Un transfusion por id /transfusion/id - {json}
router.patch("/examen/:id", bll.UpdateTest);
//#endregion

//#region Exports
module.exports = router;
//#endregion
