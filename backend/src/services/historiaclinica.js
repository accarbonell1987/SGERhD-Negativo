//#region Modelos
const HistoriaClinica = require("../models/models").HistoriaClinica;
var mongoose = require("mongoose");
//#endregion

//#Servicios
const PatientService = require("../services/patients");
//#endregion

//#region HistoriaClinicas
exports.GetClinicsHistory = async (query, page, limit) => {
	try {
		var clinicshistory = await HistoriaClinica.find(query).populate({
			path: "paciente",
			populate: { path: "transfusiones" },
		});
		return clinicshistory;
	} catch (err) {
		console.log("Error: Obteniendo Historias Clinicas");
		throw Error("Obteniendo Historias Clinicas");
	}
};
exports.GetClinicHistory = async (id) => {
	try {
		var clinichistory = await HistoriaClinica.findById(id).populate({
			path: "paciente",
			populate: { path: "transfusiones" },
		});
		return clinichistory;
	} catch (err) {
		console.log("Error: Obteniendo Historia Clinica con id: " + id);
		throw Error("Obteniendo Historia Clinica con id: " + id);
	}
};
exports.GetClinicHistoryLastInserted = async () => {
	try {
		var clinichistory = await HistoriaClinica.find().sort({ _id: -1 }).limit(1);
		return clinichistory;
		// return null;
	} catch (err) {
		console.log("Error: Obteniendo Ultimo");
		throw Error("Obteniendo Ultimo");
	}
};
exports.InsertClinicHistory = async (body) => {
	try {
		const {
			fechaDeCreacion,
			areaDeSalud,
			numerohistoria,
			vacunaAntiD,
			numeroDeEmbarazos,
			numeroDePartos,
			numeroDeAbortos,
			paciente,
			activo,
		} = body;

		const clinichistory = new HistoriaClinica({
			fechaDeCreacion,
			areaDeSalud,
			numerohistoria,
			vacunaAntiD,
			numeroDeEmbarazos,
			numeroDePartos,
			numeroDeAbortos,
			paciente,
			activo,
		});

		const modelhistoria = await HistoriaClinica.findOne({ paciente: paciente });
		if (modelhistoria == null) {
			const saved = await clinichistory.save();
			const updated = await PatientService.UpdatePatientClinicHistory(
				paciente,
				saved
			);
			return saved;
		} else throw Error("HistoriaClinica ya existente");
	} catch (err) {
		console.log("Error: Insertando HistoriaClinica: " + err);
		throw Error("Insertando HistoriaClinica: " + err);
	}
};
exports.UpdateClinicHistory = async (id, body) => {
	try {
		const {
			fechaDeCreacion,
			areaDeSalud,
			numerohistoria,
			vacunaAntiD,
			numeroDeEmbarazos,
			numeroDePartos,
			numeroDeAbortos,
			paciente,
			activo,
		} = body;

		const clinichistory = {
			fechaDeCreacion,
			areaDeSalud,
			numerohistoria,
			vacunaAntiD,
			numeroDeEmbarazos,
			numeroDePartos,
			numeroDeAbortos,
			paciente,
			activo,
		};

		var updated = await HistoriaClinica.findByIdAndUpdate(id, clinichistory);
		return updated;
	} catch (err) {
		console.log("Error: Modificando HistoriaClinica: " + err);
		throw Error("Modificando HistoriaClinica: " + err);
	}
};
exports.DeleteClinicHistory = async (clinichistory) => {
	try {
		var removed = await HistoriaClinica.findByIdAndRemove(clinichistory._id);
		var updatedpatient = await PatientService.DeleteClinicHistoryInPatient(
			clinichistory
		);
		return removed;
	} catch (err) {
		console.log("Error: Eliminando Historia Clinica" + err);
		throw Error("Eliminando Historia Clinica: " + err);
	}
};
exports.DeleteClinicHistoryFromPatient = async (patient) => {
	try {
		var removed = await HistoriaClinica.findByIdAndRemove(
			patient.historiaclinica
		);
		return removed;
	} catch (err) {
		console.log(
			"Error: (DeleteClinicHistoryFromPatient) Eliminando Historia Clinica" +
				err
		);
		throw Error(
			"(DeleteClinicHistoryFromPatient) Eliminando Historia Clinica: " + err
		);
	}
};
exports.DisableClinicHistory = async (id, clinichistory) => {
	try {
		if (clinichistory.activo) {
			clinichistory = { activo: false };
			var updated = await HistoriaClinica.findByIdAndUpdate(id, clinichistory);
			return updated;
		} else {
			return await exports.DeleteClinicHistory(clinichistory);
		}
	} catch (err) {
		console.log("Error: Desactivando Historia Clinica: " + err);
		throw Error("Desactivando Historia Clinica: " + err);
	}
};
//#endregion
