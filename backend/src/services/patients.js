//#region Modelos
const Paciente = require("../models/models").Paciente;
var mongoose = require("mongoose");
//#endregion

//#Servicios
const ClinicHistoryService = require("../services/historiaclinica");
//#endregion

//#region Funciones Ayudantes
VincularMadre = async (sexo, hijos) => {
  try {
    //asignarle el madre al hijo correspondiente
    if (hijos) {
      await hijos.forEach(hijo => {
        var modelhijo = await Paciente.findById(hijo);
        if (sexo === "F") modelhijo.madre = id;
          await modelhijo.save();
      });
    }
  } catch (err) {
    console.log("Error: (VincularMadre) Modificando Paciente: " + err);
		throw Error("(VincularMadre) Modificando Paciente: " + err);
  }
  
}
DesvincularMadre = async (sexo, hijoseliminados) => {
  try {
    //asignar null al hijo correspondiente
    if (hijoseliminados) {
      //eliminar la madre al hijo
      await hijoseliminados.forEach(hijo => {
        var modelhijo = await Paciente.findById(hijo);
          if (sexo === "F") modelhijo.madre = mongoose.mongo.ObjectID();
          await modelhijo.save();
      });
    }
  } catch (err) {
    console.log("Error: (DesvincularMadre) Modificando Paciente: " + err);
		throw Error("(DesvincularMadre) Modificando Paciente: " + err);
  }
}
//#endregion

//#region Pacientes
exports.GetPatients = async (query, page, limit) => {
	try {
		var patients = await Paciente.find(query)
			.populate("historiaclinica")
			.populate("madre")
			.populate("transfusiones");
		return patients;
	} catch (err) {
		console.log("Error: Obteniendo Pacientes");
		throw Error("Obteniendo Pacientes");
	}
};
exports.GetPatient = async (id) => {
	try {
		var patient = await Paciente.findById(id)
			.populate("historiaclinica")
			.populate("madre")
			.populate("transfusiones");
		return patient;
	} catch (err) {
		console.log("Error: Obteniendo Paciente con id: " + id);
		throw Error("Obteniendo Paciente con id: " + id);
	}
};
exports.InsertPatient = async (body) => {
	try {
		var {
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
			transfusiones,
			embarazos,
			examenes,
			activo,
		} = body;

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
			transfusiones,
			embarazos,
			examenes,
			activo,
		});

    const modelpaciente = await Paciente.findOne({ ci: ci });
    if (!modelpaciente) {
      const saved = await patient.save();
      return saved;
    } else 
      throw Error("Paciente ya existente");
	} catch (err) {
		console.log("Error: Insertando Paciente: " + err);
		throw Error("Insertando Paciente: " + err);
	}
};
exports.UpdatePatient = async (id, body) => {
	try {
		const {
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
			transfusiones,
			embarazos,
			examenes,
			activo,
			hijoseliminados,
		} = body;

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
			transfusiones,
			embarazos,
			examenes,
			activo,
		};
    
    await this.VincularMadre(sexo, hijos);
    await this.DesvincularMadre(sexo, hijoseliminados);

		var updated = await Paciente.findByIdAndUpdate(id, patient);
		return updated;
	} catch (err) {
		console.log("Error: Modificando Paciente: " + err);
		throw Error("Modificando Paciente: " + err);
	}
};
exports.DisablePatient = async (id, patient) => {
	try {
		if (patient.activo) {
			patient = { activo: false };
			var updated = await Paciente.findByIdAndUpdate(id, patient);
			//desactivar todo lo que tiene que ver con el paciente
			//transfusiones, examenes, historiaclinica, embarazos
			return updated;
		} else {
			return await exports.DeletePatient(patient);
		}
	} catch (err) {
		console.log("Error: Modificando Paciente: " + err);
		throw Error("Modificando Paciente: " + err);
	}
};
exports.DeletePatient = async (patient) => {
	try {
		var removed = await Paciente.findByIdAndRemove(patient._id);
		//eliminar todo lo que tiene que ver con el paciente
		//transfusiones, examenes, historiaclinica, embarazos
		await ClinicHistoryService.DeleteClinicHistoryFromPatient(patient);
		return removed;
	} catch (err) {
		console.log("Error: Eliminando Paciente" + err);
		throw Error("Eliminando Paciente: " + err);
	}
};
//modificar el paciente cuando se agrega una historia clinica
exports.UpdatePatientClinicHistory = async (id, clinichistory) => {
	try {
		const patient = { historiaclinica: clinichistory };
		var updated = await Paciente.findByIdAndUpdate(id, patient);
		return updated;
	} catch (err) {
		console.log();
		throw Error("(UpdatePatientClinicHistory) Modificando Paciente: " + err);
	}
};
//insertar una transfusion perteneciente al paciente
exports.InsertTranToPatient = async (tran) => {
	try {
		const patient = await Paciente.findById(tran.paciente);
		await patient.push(tran);
		const saved = await patient.save();
		return saved;
	} catch (err) {
		console.log("Error: Insertando Transfusion en Paciente: " + err);
		throw Error("Insertando Transfusion en Paciente: " + err);
	}
};
//eliminar una transfusion perteneciente al paciente
exports.DeleteTranInPatient = async (tran) => {
	try {
		//paciente perteneciente a la transfusion
		var paciente = tran.paciente;
		//buscar el indice del elemento que representa esa tranfusion en el arreglo de tranfusiones del paciente
		let index = await paciente.transfusiones.indexOf(tran._id);
		//eliminar del arreglo el elemento
		let trans = await paciente.transfusiones.splice(index, 1);
		//hacer un update del paciente
		const patient = { transfusiones: trans };
		var updated = await Paciente.findByIdAndUpdate(paciente._id, patient);
		return updated;
	} catch (err) {
		console.log("Error: (DeleteTranInPatient) Transfusion en Paciente: " + err);
		throw Error("(DeleteTranFromPatient) Transfusion en Paciente: " + err);
	}
};
//cuando se elimina la historia clinica perteneciente al paciente se le asinga un
//nuevo id que no pertenece a ninguna historia en el paciente
exports.DeleteClinicHistoryInPatient = async (clinichistory) => {
	try {
		//paciente perteneciente a la historia clinica
		var paciente = clinichistory.paciente;
		//asigno nuevo id a la historiaclinica del paciente el cual no tiene relacion
		const patient = { historiaclinica: new mongoose.ObjectId() };
		var updated = await Paciente.findByIdAndUpdate(paciente._id, patient);
		return updated;
	} catch (err) {
		console.log(
			"Error: (DeleteClinicHistoryInPatient) Transfusion en Paciente: " + err
		);
		throw Error(
			"(DeleteClinicHistoryInPatient) Transfusion en Paciente: " + err
		);
	}
};
//#endregion
