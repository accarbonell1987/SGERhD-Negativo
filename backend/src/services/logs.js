//#region Modelos
const Log = require('../models/models').LogAcceso;
//#endregion

//#Servicios
const UserServices = require('../services/users');
//#endregion

//#region Logs
exports.GetLogs = async (query, page, limit) => {
    try {
        var logs = await Log.find(query);
        return logs;
    } catch (err) {
        console.log('Error: Obteniendo Logs');
        throw Error('Obteniendo Logs');
    }
}
exports.GetLog = async (id) => {
    try {
        var log = await Log.findById(id);
        return log;
    } catch (err) {
        console.log('Error: Obteniendo Log con id: ' + id);
        throw Error('Obteniendo Log con id: ' + id);
    }
}
exports.GetLogByUserId = async (id) => {
    try {
        var log = await Log.find(p => p.usuario === id.toString());
        return log;
    } catch (err) {
        console.log('Error: Obteniendo Log con id: ' + id);
        throw Error('Obteniendo Log con id: ' + id);
    }
}
exports.InsertLog = async (body) => {
    const { fecha, usuario } = body;
    const log = new Log({ fecha, usuario });
    try {
        const saved = log.save().then(p => {
            //adicionando el log al usuario
            UserServices.InserLogToUser(p);
        });
        return saved;
    } catch(err) {
        console.log('Error: Insertando Log: ' + err);
        throw Error('Insertando Log: ' + err);
    };
}
exports.DeleteLog = async (id) => {
    try {
        var removed = await Log.findByIdAndRemove(id);
        return removed;
    } catch(err) {
        console.log('Error: Eliminando Logs' + err);
        throw Error('Eliminando Log: ' + err);
    };
}
exports.UpdateLog = async () => {
    try {
        throw Error('No Permitido, Modificar Log: ' + err);
    } catch(err) {
        console.log('Error: Modificando Log: ' + err);
        throw Error('Modificando Log: ' + err);
    }
}
//#endregion