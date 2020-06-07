//#region Modelos
const Transfusion = require("../models/models").Transfusion;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const PatientServices = require("../services/patients");
//#endregion

//#region Transfusiones
exports.GetTrans = async (query, page, limit) => {
	try {
		var trans = await Transfusion.find(query).populate("paciente");
		return trans;
	} catch (err) {
		throw Error("GetTrans -> Obteniendo Transfusiones.");
	}
};
exports.GetTran = async (id) => {
	try {
		var tran = await Transfusion.findById(id).populate("paciente");
		return tran;
	} catch (err) {
		throw Error("GetTran -> Obteniendo Transfusion con id: " + id);
	}
};
exports.InsertTran = async (body) => {
	try {
		var { fecha, observaciones, reacionAdversa, paciente, activo } = body;
		const tran = new Transfusion({
			fecha,
			observaciones,
			reacionAdversa,
			paciente,
			activo,
		});

		const exist = await Transfusion.findOne({
			paciente: paciente,
			fecha: fecha,
		});

		if (exist == null) {
			const transaved = await tran.save();
			const insertedinpatient = await PatientServices.InsertTranToPatient(
				transaved
			);
			return transaved;
		}
	} catch (err) {
		throw Error("InsertTran -> Insertando Transfusion \n" + err);
	}
};
exports.UpdateTran = async (id, body) => {
	try {
		var { fecha, observaciones, reacionAdversa, paciente, activo } = body;
		const tran = { fecha, observaciones, reacionAdversa, paciente, activo };

		const updated = await Transfusion.findByIdAndUpdate(id, tran);
		return updated;
	} catch (err) {
		throw Error("UpdateTran -> Modificando Transfusion \n" + err);
	}
};
exports.DeleteTran = async (tran) => {
	try {
		const removed = await Transfusion.findByIdAndRemove(tran._id);
		const deletetrans = await PatientServices.DeleteTranInPatient(tran);
		return removed;
	} catch (err) {
		throw Error("DeleteTran -> Eliminando Transfusion \n" + err);
	}
};
exports.DisableTran = async (id, tran) => {
	try {
		if (tran.activo) {
			tran = { activo: false };
			var updated = await Transfusion.findByIdAndUpdate(id, tran);
			return updated;
		} else {
			return await exports.DeleteTran(tran);
		}
	} catch (err) {
		throw Error("DisableTran -> Desactivando Transfusion \n" + err);
	}
};
//#endregion
