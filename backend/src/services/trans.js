//#region Modelos
const Transfusion = require("../models/models").Transfusion;
var mongoose = require("mongoose");
//#endregion

const PatientServices = require("../services/patients");

//#region Transfusiones
exports.GetTrans = async (query, page, limit) => {
	try {
		var trans = await Transfusion.find(query).populate("paciente");
		return trans;
	} catch (err) {
		console.log("Error: Obteniendo Transfusiones");
		throw Error("Obteniendo Transfusiones");
	}
};
exports.GetTran = async (id) => {
	try {
		var tran = await Transfusion.findById(id).populate("paciente");
		return tran;
	} catch (err) {
		console.log("Error: Obteniendo Transfusion con id: " + id);
		throw Error("Obteniendo Transfusion con id: " + id);
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

		if (!exist) {
			const transaved = await tran.save();
			const insertedinpatient = await PatientServices.InsertTranToPatient(
				transaved
			);
			return transaved;
		}
	} catch (err) {
		console.log("Error: Insertando Transfusion: " + err);
		throw Error("Insertando Transfusion: " + err);
	}

	Transfusion.findOne({ paciente: paciente, fecha: fecha }).then((doc) => {
		if (!doc) {
			tran
				.save()
				.then((saved) => PatientServices.InsertTranToPatient(saved))
				.then((saved) => {
					return saved;
				})
				.catch((err) => {
					console.log("Error: Insertando Transfusion: " + err);
					throw Error("Insertando Transfusion: " + err);
				});
		} else throw Error("Transfusion ya existente");
	});
};
exports.UpdateTran = async (id, body) => {
	try {
		var { fecha, observaciones, reacionAdversa, paciente, activo } = body;
		const tran = { fecha, observaciones, reacionAdversa, paciente, activo };

		const updated = await Transfusion.findByIdAndUpdate(id, tran);
		return updated;
	} catch (err) {
		console.log("Error: Modificando Transfusion: " + err);
		throw Error("Modificando Transfusion: " + err);
	}
};
exports.DeleteTran = async (tran) => {
	try {
		const removed = await Transfusion.findByIdAndRemove(tran._id);
		const deletetrans = await PatientServices.DeleteTranInPatient(tran);
		return removed;
	} catch (err) {
		console.log("Error: Eliminando Transfusion" + err);
		throw Error("Eliminando Transfusion: " + err);
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
		console.log("Error: Desactivando Transfusion: " + err);
		throw Error("Desactivando Transfusion: " + err);
	}
};
//#endregion
