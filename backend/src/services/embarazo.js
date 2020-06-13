//#region Modelos
const Embarazo = require("../models/models").Embarazo;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const PatientServices = require("../services/patients");
//#endregion

//#region Embarazo
exports.GetPregnancies = async (query, page, limit) => {
	try {
		var pregnancies = await Embarazo.find(query).populate("paciente").populate("examenes");
		return pregnancies;
	} catch (err) {
		throw Error("GetPregnancies -> Obteniendo Embarazos.");
	}
};
exports.GetPregnancy = async (id) => {
	try {
		var pregnancy = await Embarazo.findById(id).populate("paciente").populate("examenes");
		return pregnancy;
	} catch (err) {
		throw Error("GetPregnancy -> Obteniendo Embarazo con id: " + id);
	}
};
exports.InsertPregnancy = async (body) => {
	try {
		var { fecha, observaciones, examenes, tipo, semanas, dias, findeembarazo, findeaborto, findeparto, paciente, activo } = body;
		const pregnancy = new Embarazo({
			fecha,
			observaciones,
			examenes,
			tipo,
			semanas,
			dias,
			findeembarazo,
			findeaborto,
			findeparto,
			paciente,
			activo,
		});

		const exist = await Embarazo.findOne({
			paciente: paciente,
			fecha: fecha,
		});

		if (exist == null) {
			const pregnancysaved = await pregnancy.save();
			const insertedinpatient = await PatientServices.InsertPregnancyToPatient(pregnancysaved);
			return pregnancysaved;
		}
	} catch (err) {
		throw Error("InsertPregnancy -> Insertando Embarazo \n" + err);
	}
};
exports.UpdatePregnancy = async (id, body) => {
	try {
		var { fecha, observaciones, examenes, tipo, semanas, dias, findeembarazo, findeaborto, findeparto, paciente, activo } = body;
		const pregnancy = { fecha, observaciones, examenes, tipo, semanas, dias, findeembarazo, findeaborto, findeparto, paciente, activo };
		const updated = await Embarazo.findByIdAndUpdate(id, pregnancy);
		return updated;
	} catch (err) {
		throw Error("UpdatePregnancy -> Modificando Embarazo \n" + err);
	}
};
exports.DeletePregnancy = async (pregnancy) => {
	try {
		const deletepregnancy = await PatientServices.DeletePregnancyInPatient(pregnancy);
		const removed = await Embarazo.findByIdAndRemove(pregnancy._id);
		return removed;
	} catch (err) {
		throw Error("DeletePregnancy -> Eliminando Embarazo \n" + err);
	}
};
exports.DeletePregnancies = async (pregnancies) => {
	try {
		await pregnancies.forEach(async (pregnancy) => {
			await Embarazo.findByIdAndRemove(pregnancy._id);
		});
	} catch (err) {
		throw Error("DeletePregnancies -> Eliminando Embarazos \n" + err);
	}
};
exports.DisablePregnancy = async (id, pregnancy) => {
	try {
		if (pregnancy.activo) {
			pregnancy = { activo: false };
			var updated = await Embarazo.findByIdAndUpdate(id, pregnancy);
			return updated;
		} else {
			return await exports.DeletePregnancy(pregnancy);
		}
	} catch (err) {
		throw Error("DisablePregnancy -> Desactivando Embarazo \n" + err);
	}
};
exports.DisablePregnancies = async (pregnancies) => {
	try {
		await pregnancies.forEach(async (pregnancy) => {
			const update = { activo: false };
			await Embarazo.findByIdAndUpdate(pregnancy._id, update);
		});
	} catch (err) {
		throw Error("DisablePregnancies -> Desactivando Embarazo \n" + err);
	}
};
//#endregion
