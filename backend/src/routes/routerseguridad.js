//#region Requeridos
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
//#endregion

//#region Modelos
const Usuario = require("../models/models").Usuario;
const mongo = require("../models/models");
//#endregion

//#region Services
var LogServices = require("../services/logs");
var UserServices = require("../services/usuario");
//#endregion

//#region Constantes
const jwtkey = process.env.JWT_KEY;
//#endregion

//#region Rutas
router.get("/seguridad/comienzo", (req, res) => {
  try {
    //Conexion del mongo a la bd
    mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB error en conexion:"));
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
      if (collections.length === 0) {
        //insertar usuario admin
        var user = UserServices.InsertUser({
          nombre: "administrador",
          contraseña: "administrador",
          rol: "informatico",
          email: "administradorsgerhn@bancodesangre.stg.sld.cu",
          activo: true,
        });
        res.status(200).json({
          status: 200,
          message: "Insertado Usuario Administrador",
          data: user,
        });
      } else res.status(202).json({ status: 202, message: "Sistema Iniciado" });
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: err });
  }
});

//POST - {json}
router.post("/seguridad/autenticar", async (req, res) => {
  try {
    await Usuario.findOne({
      nombre: req.body.nombre,
      contraseña: req.body.contraseña,
    })
      .then((user) => {
        if (user === null)
          res.status(400).json({
            status: 400,
            message: "Usuario o Contraseña Incorrecto",
            data: user,
          });
        else {
          const fechaAhora = new Date();

          const payload = { check: true };
          const token = jwt.sign(payload, jwtkey, { expiresIn: 1440 });
          LogServices.InsertLog({ fecha: fechaAhora, usuario: user._id });
          res.status(200).json({
            status: 200,
            message: "Autenticado",
            data: user,
            token: token,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({ status: 400, message: err });
      });
  } catch (err) {
    res.status(400).json({ status: 400, message: err });
  }
});
//#endregion

//#region Exports
module.exports = router;
//#endregion
