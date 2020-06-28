//#region Modelos
const Paciente = require("../models/models").Paciente;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const ClinicHistoryService = require("./historiaclinica");
const TransService = require("./trans");
const PregnancyService = require("./embarazo");
const TestService = require("./examen");
//#endregion

//#region Funciones Ayudantes
VincularMadre = async (id, sexo, hijos) => {
	try {
		//asignarle el madre al hijo correspondiente
		if (hijos) {
			await hijos.forEach(async (child) => {
				var child = await Paciente.findById(child);
				if (sexo === "F") child.madre = id;
				await child.save();
			});
		}
	} catch (err) {
		throw Error("VincularMadre: " + err);
	}
};
DesvincularMadre = async (sexo, hijoseliminados) => {
	try {
		//asignar null al hijo correspondiente
		if (hijoseliminados) {
			//eliminar la madre al hijo
			await hijoseliminados.forEach(async (hijo) => {
				var modelhijo = await Paciente.findById(hijo);
				if (sexo === "F") modelhijo.madre = null;
				await modelhijo.save();
			});
		}
	} catch (err) {
		throw Error("DesvincularMadre: " + err);
	}
};
EliminarHijoDeMadre = async (hijo) => {
	try {
		if (hijo.madre != null) {
			var madre = hijo.madre;
			var hijos = [...madre.hijos];
			//buscar el indice del elemento que representa esa tranfusion en el arreglo de tranfusiones del paciente
			let index = hijos[hijo._id];
			if (index) {
				//eliminar del arreglo el elemento
				hijos.splice(index, 1);
				//hacer un update del paciente
				const update = { hijos: hijos };
				var updated = await Paciente.findByIdAndUpdate(madre._id, update);
				return updated;
			}
		}
	} catch (err) {
		throw Error("EliminarHijoDeMadre: " + err);
	}
};

//#endregion

//#region Pacientes
exports.GetPatients = async (query, page, limit) => {
	try {
		var patients = await Paciente.find(query)
			.populate("historiaclinica")
			.populate("madre")
			.populate({ path: "transfusiones", populate: { path: "paciente" } })
			.populate({ path: "examenes", populate: { path: "paciente" } })
			.populate({ path: "embarazos", populate: { path: "paciente" } })
			.populate({ path: "embarazos", populate: { path: "examenes", populate: { path: "pruebas" } } })
			.populate({ path: "embarazos", populate: { path: "examenes", populate: { path: "embarazo" } } });
		return patients;
	} catch (err) {
		throw Error("GetPatients -> Obteniendo Pacientes.");
	}
};
exports.GetPatient = async (id) => {
	try {
		var patient = await Paciente.findById(id)
			.populate("historiaclinica")
			.populate("madre")
			.populate({ path: "transfusiones", populate: { path: "paciente" } })
			.populate({ path: "examenes", populate: { path: "paciente" } })
			.populate({ path: "embarazos", populate: { path: "paciente" } })
			.populate({ path: "embarazos", populate: { path: "examenes", populate: { path: "pruebas" } } })
			.populate({ path: "embarazos", populate: { path: "examenes", populate: { path: "embarazo" } } });
		return patient;
	} catch (err) {
		throw Error("GetPatient -> Obteniendo Paciente con id: " + id);
	}
};
exports.InsertPatient = async (body) => {
	try {
		var { fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, conyuge, transfusiones, embarazos, examenes, activo } = body;

		const patient = new Paciente({
			fechaDeCreacion,
			nombre,
			apellidos,
			ci,
			direccion,
			direccionopcional,
			telefono,
			sexo,
			historiaclinica,
			madre,
			hijos,
			conyuge,
			transfusiones,
			embarazos,
			examenes,
			activo,
		});

		const modelpaciente = await Paciente.findOne({ ci: ci });
		if (modelpaciente == null) {
			const saved = await patient.save();
			return saved;
		} else throw Error("Paciente ya existente");
	} catch (err) {
		throw Error("InsertPatient -> Insertando Paciente \n" + err);
	}
};
exports.UpdatePatient = async (id, body) => {
	try {
		const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, conyuge, transfusiones, embarazos, examenes, activo, hijoseliminados } = body;

		const patient = {
			nombre,
			apellidos,
			ci,
			direccion,
			direccionopcional,
			telefono,
			sexo,
			historiaclinica,
			madre,
			hijos,
			conyuge,
			transfusiones,
			embarazos,
			examenes,
			activo,
		};
		var findpatient = await Paciente.findOne({ ci: patient.ci });
		if (findpatient == null || findpatient._id == id) {
			await VincularMadre(id, sexo, hijos);
			await DesvincularMadre(sexo, hijoseliminados);

			var updated = await Paciente.findByIdAndUpdate(id, patient);
			return updated;
		} else throw Error("Existe un paciente con el carnet de identidad: " + patient.ci);
	} catch (err) {
		throw Error("UpdatePatient -> Modificando Paciente \n" + err);
	}
};
exports.DisablePatient = async (id, patient) => {
	try {
		if (patient.activo) {
			//desactivar todo lo que tiene que ver con el paciente
			//transfusiones, examenes, historiaclinica, embarazos
			if (patient.historiaclinica != null) {
				await ClinicHistoryService.DisableClinicHistory(patient.historiaclinica._id, patient.historiaclinica);
			}
			if (patient.transfusiones.length > 0) {
				await TransService.DisableTrans(patient.transfusiones);
			}
			if (patient.embarazos.length > 0) {
				await PregnancyService.DisablePregnancies(patient.embarazos);
			}
			if (patient.examenes.length > 0) {
				await TestService.DisableTests(patient.examenes);
			}
			patient.activo = false;
			var updated = await Paciente.findByIdAndUpdate(id, patient);

			return updated;
		} else {
			return await exports.DeletePatient(patient);
		}
	} catch (err) {
		throw Error("DisablePatient -> Desabilitando Paciente \n" + err);
	}
};
exports.DeletePatient = async (patient) => {
	try {
		//si tiene hijos, limpiar el campo de madre del hijo
		if (patient.hijos.length > 0) {
			await DesvincularMadre(patient.sexo, patient.hijos);
		}
		await EliminarHijoDeMadre(patient);
		//eliminar todo lo que tiene que ver con el paciente
		//transfusiones, examenes, historiaclinica, embarazos
		if (patient.historiaclinica != null) {
			await ClinicHistoryService.DeleteClinicHistoryFromPatient(patient);
		}
		if (patient.transfusiones.length > 0) {
			await TransService.DeleteTrans(patient.transfusiones);
		}
		if (patient.embarazos.length > 0) {
			await PregnancyService.DeletePregnancies(patient.embarazos);
		}
		if (patient.examenes.length > 0) {
			await TestService.DeleteTests(patient.examenes);
		}
		var removed = await Paciente.findByIdAndRemove(patient._id);
		return removed;
	} catch (err) {
		throw Error("DeletePatient -> Eliminando Paciente: \n" + err);
	}
};
//modificar el paciente cuando se agrega una historia clinica
exports.UpdatePatientClinicHistory = async (id, clinichistory) => {
	try {
		const patient = { historiaclinica: clinichistory };
		var updated = await Paciente.findByIdAndUpdate(id, patient);
		return updated;
	} catch (err) {
		throw Error("UpdatePatientClinicHistory -> Actualizando Historia Clinica del Paciente \n" + err);
	}
};
//insertar una transfusion perteneciente al paciente
exports.InsertTranToPatient = async (tran) => {
	try {
		const patient = await Paciente.findById(tran.paciente);
		await patient.transfusiones.push(tran);
		const saved = await patient.save();
		return saved;
	} catch (err) {
		throw Error("InsertTranToPatient -> Insertando Transfusion en Paciente \n" + err);
	}
};
//insertar el embarazo en el paciente que pertence
exports.InsertPregnancyToPatient = async (pregnancy) => {
	try {
		const patient = await Paciente.findById(pregnancy.paciente);
		await patient.embarazos.push(pregnancy);
		const saved = await patient.save();
		return saved;
	} catch (err) {
		throw Error("InsertPregnancyToPatient -> Insertando Embarazo en Paciente \n" + err);
	}
};
//insertar el examen al paciente que pertenece
exports.InsertTestToPatient = async (test) => {
	try {
		const patient = await Paciente.findById(test.paciente);
		await patient.examenes.push(test);
		const saved = await patient.save();
		return saved;
	} catch (err) {
		throw Error("InsertTestToPatient -> Insertando Examen en Paciente \n" + err);
	}
};
//eliminar una transfusion perteneciente al paciente
exports.DeleteTranInPatient = async (tran) => {
	try {
		transfusionespaciente = [...tran.paciente.transfusiones];
		//buscar el indice del elemento que representa esa tranfusion en el arreglo de tranfusiones del paciente
		let index = tran.paciente.transfusiones.indexOf(tran._id);
		if (index) {
			//eliminar del arreglo el elemento
			transfusionespaciente.splice(index, 1);
			//hacer un update del paciente
			const patient = { transfusiones: transfusionespaciente };
			var updated = await Paciente.findByIdAndUpdate(tran.paciente._id, patient);
		}
		return updated;
	} catch (err) {
		throw Error("DeleteTranInPatient -> Eliminando Transfusion en Paciente \n" + err);
	}
};
//eliminar una examen perteneciente al paciente
exports.DeleteTestInPatient = async (test) => {
	try {
		examenespaciente = [...test.paciente.examenes];
		//buscar el indice del elemento que representa ese examen en el arreglo de examenes del paciente
		let index = test.paciente.examenes.indexOf(test._id);
		if (index) {
			//eliminar del arreglo el elemento
			examenespaciente.splice(index, 1);
			//hacer un update del paciente
			const patient = { examenes: examenespaciente };
			var updated = await Paciente.findByIdAndUpdate(test.paciente._id, patient);
		}
		return updated;
	} catch (err) {
		throw Error("DeleteTestInPatient -> Eliminando Examen en Paciente \n" + err);
	}
};
//eliminar el elmbarazo perteneciente al paciente
exports.DeletePregnancyInPatient = async (pregnancy) => {
	try {
		embarazospaciente = [...pregnancy.paciente.embarazos];
		//buscar el indice del elemento que representa ese embarazo en el arreglo de embarazos del paciente
		let index = pregnancy.paciente.embarazos.indexOf(pregnancy._id);
		if (index) {
			//eliminar del arreglo el elemento
			embarazospaciente.splice(index, 1);
			//hacer un update del paciente
			const patient = { embarazos: embarazospaciente };
			var updated = await Paciente.findByIdAndUpdate(pregnancy.paciente._id, patient);
		}
		return updated;
	} catch (err) {
		throw Error("DeletePregnancyInPatient -> Eliminando Embarazo en Paciente \n" + err);
	}
};
//cuando se elimina la historia clinica perteneciente al paciente se le asinga un
//nuevo id que no pertenece a ninguna historia en el paciente
exports.DeleteClinicHistoryInPatient = async (clinichistory) => {
	try {
		//paciente perteneciente a la historia clinica
		var paciente = clinichistory.paciente;
		//asigno nuevo id a la historiaclinica del paciente el cual no tiene relacion
		const patient = { historiaclinica: null };
		var updated = await Paciente.findByIdAndUpdate(paciente._id, patient);
		return updated;
	} catch (err) {
		throw Error("DeleteClinicHistoryInPatient -> Eliminando Historia Clinica en Paciente \n" + err);
	}
};
//#endregion
