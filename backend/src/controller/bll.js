//#region Servicios
const PatientServices = require('../services/patients');
const UserServices = require('../services/users');
const LogServices = require('../services/logs');
//#endregion

//#region Usuarios
exports.GetUsers = async (req, res, next) => {
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : -1;

    try {
        var usuarios = await UserServices.GetUsers({}, page, limit);
        return res.status(200).json({ status: 200, message: 'Obtenidos', data: usuarios });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.GetUser = async (req, res, next) => {
    try {
        var usuario = await UserServices.GetUser(req.params.id);
        return res.status(200).json({ status: 200, message: 'Obtenido', data: usuario });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.InsertUser = async (req, res, next) => {
    try {
        usuario = await UserServices.InsertUser(req.body);
        return res.status(200).json({ status: 200, message: 'Insertado Correctamente', data: usuario });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.DeleteUser = async (req, res, next) => {
    try {
        var usuario = await UserServices.DeleteUser(req.params.id);
        return res.status(200).json({ status: 200, message: 'Eliminado Correctamente', data: usuario });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.UpdateUser = async (req, res, next) => {
    try {
        var usuario = await UserServices.UpdateUser(req.params.id, req.body);
        return res.status(200).json({ status: 200, message: 'Modificado Correctamente', data: usuario });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.UpdateUserPassword = async (req, res, next) => {
    try {
        var usuario = await UserServices.UpdateUserPassword(req.params.id, req.body);
        return res.status(200).json({ status: 200, message: 'Contraseña Modificada Correctamente', data: usuario });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
//#endregion

//#region Logs
exports.GetLogs = async (req, res, next) => {
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : -1;

    try {
        var logs = await LogServices.GetLogs({}, page, limit);
        return res.status(200).json({ status: 200, message: 'Obtenidos', data: logs });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.GetLog = async (req, res, next) => {
    try {
        var log = await LogServices.GetLog(req.params.id);
        return res.status(200).json({ status: 200, message: 'Obtenido', data: log });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.InsertLog = async (req, res, next) => {
    try {
        log = await LogServices.InsertLog(req.body);
        return res.status(200).json({ status: 200, message: 'Insertado Correctamente', data: log });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.DeleteLog = async (req, res, next) => {
    try {
        var log = await LogServices.DeleteLog(req.params.id);
        return res.status(200).json({ status: 200, message: 'Eliminado Correctamente', data: log });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.UpdateLog = async (req, res, next) => {
    try {
        var log = await LogServices.UpdateLog();
        return res.status(200).json({ status: 200, message: 'Modificado Correctamente', data: log });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
//#endregion

//#region Pacientes
exports.GetPatients = async (req, res, next) => {
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : -1;

    try {
        var pacientes = await PatientServices.GetPatients({}, page, limit);
        return res.status(200).json({ status: 200, message: 'Obtenidos', data: pacientes });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.GetPatient = async (req, res, next) => {
    try {
        var paciente = await PatientServices.GetPatient(req.params.id);
        return res.status(200).json({ status: 200, message: 'Obtenido', data: paciente });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.InsertPatient = async (req, res, next) => {
    try {
        paciente = await PatientServices.InsertPatient(req.body);
        return res.status(200).json({ status: 200, message: 'Insertado Correctamente', data: paciente });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.DeletePatient = async (req, res, next) => {
    try {
        var paciente = await PatientServices.DeletePatient(req.params.id);
        return res.status(200).json({ status: 200, message: 'Eliminado Correctamente', data: paciente });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
exports.UpdatePatient = async (req, res, next) => {
    try {
        var paciente = await PatientServices.UpdatePatient(req.params.id, req.body);
        return res.status(200).json({ status: 200, message: 'Modificado Correctamente', data: paciente });
    } catch(err) {
        return res.status(400).json({ status: 400, message: err });
    }
}
//#endregion