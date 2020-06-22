//#region Modelos
const Log = require("../models/models").LogAcceso;
//#endregion

//#region Servicios
const UserServices = require("./usuario");
//#endregion

//#region Logs
exports.GetLogs = async (query, page, limit) => {
  try {
    var logs = await Log.find(query).populate("usuario");
    return logs;
  } catch (err) {
    throw Error("GetLogs -> Obteniendo Logs.");
  }
};
exports.GetLog = async (id) => {
  try {
    var log = await Log.findById(id).populate("usuario");
    return log;
  } catch (err) {
    throw Error("GetLog -> Obteniendo Log con id: " + id);
  }
};
exports.InsertLog = async (body) => {
  const { fecha, usuario } = body;
  const log = new Log({ fecha, usuario });
  try {
    const saved = await log.save();
    await UserServices.InserLogToUser(saved);
    return saved;
  } catch (err) {
    throw Error("InsertLog -> Insertando Log \n" + err);
  }
};
exports.DeleteLog = async (id) => {
  try {
    var removed = await Log.findByIdAndRemove(id);
    return removed;
  } catch (err) {
    throw Error("DeleteLog -> Eliminando Log \n" + err);
  }
};
exports.DeleteLogByUserId = async (id) => {
  try {
    var deleated = await Log.deleteMany({ usuario: id });
    return deleated;
  } catch (err) {
    throw Error("DeleteLogByUserId -> Eliminando Log por Id de Usuario: " + id);
  }
};
exports.UpdateLog = async () => {
  try {
    throw Error("No Permitido, Modificar Log: " + err);
  } catch (err) {
    throw Error("UpdateLog -> Modificando Log \n" + err);
  }
};
//#endregion
