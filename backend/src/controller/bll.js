//#region Servicios de Clases
const ClinicHistoryServices = require("../services/historiaclinica");
const PatientServices = require("../services/patients");
const UserServices = require("../services/users");
const LogServices = require("../services/logs");
const TranServices = require("../services/trans");
//#endregion

//#region Usuarios
exports.GetUsers = async (req, res, next) => {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : -1;

	try {
		var usuarios = await UserServices.GetUsers({}, page, limit).then(
			(users) => {
				return res
					.status(200)
					.json({ status: 200, message: "Obtenidos", data: users });
			}
		);
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.GetUser = async (req, res, next) => {
	try {
		var usuario = await UserServices.GetUser(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenido", data: usuario });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.InsertUser = async (req, res, next) => {
	try {
		usuario = await UserServices.InsertUser(req.body);
		return res
			.status(200)
			.json({ status: 200, message: "Insertado Correctamente", data: usuario });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DeleteUser = async (req, res, next) => {
	try {
		var user = await UserServices.DeleteUser(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Eliminado Correctamente", data: user });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DisableUser = async (req, res, next) => {
	try {
		let requser = req.body;

		let message = "Eliminado Correctamente";
		if (requser.activo) message = "Desactivado Correctamente";

		var user = await UserServices.DisableUser(req.params.id, requser);
		return res.status(200).json({ status: 200, message: message, data: user });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.UpdateUser = async (req, res, next) => {
	try {
		var usuario = await UserServices.UpdateUser(req.params.id, req.body);
		return res.status(200).json({
			status: 200,
			message: "Modificado Correctamente",
			data: usuario,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.UpdateUserPassword = async (req, res, next) => {
	try {
		var usuario = await UserServices.UpdateUserPassword(
			req.params.id,
			req.body
		);
		return res.status(200).json({
			status: 200,
			message: "Contraseña Modificada Correctamente",
			data: usuario,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
//#endregion

//#region Logs
exports.GetLogs = async (req, res, next) => {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : -1;

	try {
		var logs = await LogServices.GetLogs({}, page, limit);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenidos", data: logs });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.GetLog = async (req, res, next) => {
	try {
		var log = await LogServices.GetLog(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenido", data: log });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.InsertLog = async (req, res, next) => {
	try {
		log = await LogServices.InsertLog(req.body);
		return res
			.status(200)
			.json({ status: 200, message: "Insertado Correctamente", data: log });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DeleteLog = async (req, res, next) => {
	try {
		var log = await LogServices.DeleteLog(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Eliminado Correctamente", data: log });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.UpdateLog = async (req, res, next) => {
	try {
		var log = await LogServices.UpdateLog();
		return res
			.status(200)
			.json({ status: 200, message: "Modificado Correctamente", data: log });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
//#endregion

//#region Pacientes
exports.GetPatients = async (req, res, next) => {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : -1;

	try {
		var pacientes = await PatientServices.GetPatients({}, page, limit);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenidos", data: pacientes });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.GetPatient = async (req, res, next) => {
	try {
		var paciente = await PatientServices.GetPatient(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenido", data: paciente });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.InsertPatient = async (req, res, next) => {
	try {
		paciente = await PatientServices.InsertPatient(req.body);
		return res.status(200).json({
			status: 200,
			message: "Insertado Correctamente",
			data: paciente,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DeletePatient = async (req, res, next) => {
	try {
		var paciente = await PatientServices.DesactivatePatient(req.params.id);
		return res.status(200).json({
			status: 200,
			message: "Eliminado Correctamente",
			data: paciente,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DisablePatient = async (req, res, next) => {
	try {
		let reqpatient = req.body;

		let message = "Eliminado Correctamente";
		if (reqpatient.activo) message = "Desactivado Correctamente";

		var patient = await PatientServices.DisablePatient(
			req.params.id,
			reqpatient
		);
		return res
			.status(200)
			.json({ status: 200, message: message, data: patient });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.UpdatePatient = async (req, res, next) => {
	try {
		var paciente = await PatientServices.UpdatePatient(req.params.id, req.body);
		return res.status(200).json({
			status: 200,
			message: "Modificado Correctamente",
			data: paciente,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
//#endregion

//#region Historia Clinica
exports.GetClinicsHistory = async (req, res, next) => {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : -1;

	try {
		var clinicshistory = await ClinicHistoryServices.GetClinicsHistory(
			{},
			page,
			limit
		);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenidos", data: clinicshistory });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.GetClinicHistory = async (req, res, next) => {
	try {
		const id = req.params.id;
		var clinichistory = {};

		if (id == -1)
			clinichistory = await ClinicHistoryServices.GetClinicHistoryLastInserted();
		else
			clinichistory = await ClinicHistoryServices.GetClinicHistory(
				req.params.id
			);

		return res
			.status(200)
			.json({ status: 200, message: "Obtenido", data: clinichistory });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.GetClinicHistoryLastInserted = async (req, res, next) => {
	try {
		var clinichistory = await ClinicHistoryServices.GetClinicHistoryLastInserted();
		return res
			.status(200)
			.json({ status: 200, message: "Obtenido", data: clinichistory });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.InsertClinicHistory = async (req, res, next) => {
	try {
		var clinichistory = await ClinicHistoryServices.InsertClinicHistory(
			req.body
		);
		return res.status(200).json({
			status: 200,
			message: "Insertado Correctamente",
			data: clinichistory,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DeleteClinicHistory = async (req, res, next) => {
	try {
		var clinichistory = await ClinicHistoryServices.DesactivateClinicHistory(
			req.params.id
		);
		return res.status(200).json({
			status: 200,
			message: "Eliminado Correctamente",
			data: clinichistory,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DisableClinicHistory = async (req, res, next) => {
	try {
		let reqclinichistory = req.body;

		let message = "Eliminado Correctamente";
		if (reqclinichistory.activo) message = "Desactivado Correctamente";

		var clinichistory = await ClinicHistoryServices.DisableClinicHistory(
			req.params.id,
			reqclinichistory
		);
		return res
			.status(200)
			.json({ status: 200, message: message, data: clinichistory });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.UpdateClinicHistory = async (req, res, next) => {
	try {
		var clinichistory = await ClinicHistoryServices.UpdateClinicHistory(
			req.params.id,
			req.body
		);
		return res.status(200).json({
			status: 200,
			message: "Modificado Correctamente",
			data: clinichistory,
		});
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
//#endregion

//#region Transfusion
exports.GetTrans = async (req, res, next) => {
	var page = req.params.page ? req.params.page : 1;
	var limit = req.params.limit ? req.params.limit : -1;

	try {
		var trans = await TranServices.GetTrans({}, page, limit);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenidos", data: trans });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.GetTran = async (req, res, next) => {
	try {
		const id = req.params.id;
		var tran = await TranServices.GetTran(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Obtenido", data: tran });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.InsertTran = async (req, res, next) => {
	try {
		var tran = await TranServices.InsertTran(req.body);
		return res
			.status(200)
			.json({ status: 200, message: "Insertado Correctamente", data: tran });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DeleteTran = async (req, res, next) => {
	try {
		var tran = await TranServices.DesactivateTran(req.params.id);
		return res
			.status(200)
			.json({ status: 200, message: "Eliminado Correctamente", data: tran });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.DisableTran = async (req, res, next) => {
	try {
		let reqtran = req.body;

		let message = "Eliminado Correctamente";
		if (reqtran.activo) message = "Desactivado Correctamente";

		var tran = await TranServices.DisableTran(req.params.id, reqtran);
		return res.status(200).json({ status: 200, message: message, data: tran });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
exports.UpdateTran = async (req, res, next) => {
	try {
		var tran = await TranServices.UpdateTran(req.params.id, req.body);
		return res
			.status(200)
			.json({ status: 200, message: "Modificado Correctamente", data: tran });
	} catch (err) {
		return res.status(400).json({ status: 400, message: err.toString() });
	}
};
//#endregion
