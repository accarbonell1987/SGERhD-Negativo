//#region Modelos
const Examen = require("../models/models").Examen;
const Prueba = require("../models/models").Prueba;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const TestServices = require("./examen");
const GrupoSanguineoServices = require("./pruebas/gruposanguineo");
//#endregion

//#region Examen
exports.GetPruebas = async (query, page, limit) => {
	try {
		var pruebas = await Examen.find(query).populate({ path: "examen", populate: { path: "paciente" } });
		return pruebas;
	} catch (err) {
		throw Error("GetTests -> Obteniendo Pruebas.");
	}
};
exports.GetPrueba = async (id) => {
	try {
		var prueba = await Examen.findById(id).populate({ path: "examen", populate: { path: "paciente" } });
		return prueba;
	} catch (err) {
		throw Error("GetTest -> Obteniendo Prueba con id: " + id);
	}
};
exports.InsertPrueba = async (body) => {
	try {
		var { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, tiempoDeGestacion, activo } = body;
		const prueba = new Prueba({
			fecha,
			tipo,
			examen,
			grupoSanguineo,
			identificacionAnticuerpo,
			pesquizajeAnticuerpo,
			pendiente,
			numeroMuestra,
			tiempoDeGestacion,
			activo,
		});
		var saved = await prueba.save();
		//almacenar la prueba de tipo grupo sanguineo
		if (tipo === "Grupo Sanguineo") {
			var gruposanguineo = GrupoSanguineoServices.InsertGrupoSanguineo(body, prueba);
			//actualizar la prueba asignandole el grupo sanguineo
			saved = { grupoSanguineo: gruposanguineo };
			await Prueba.findByIdAndUpdate(id, saved);
		} else if (tipo === "Identificación Anticuerpo") {
			//TODO insertar identificacion
		} else if (tipo === "Pesquizaje Anticuerpo") {
			//TODO insertar pesquizaje
		}
		//se adiciona la Prueba en el Examen
		await TestServices.InsertPruebaToTest(saved);
		return saved;
	} catch (err) {
		throw Error("InsertPrueba -> Insertando Prueba \n" + err);
	}
};
exports.UpdatePrueba = async (id, body) => {
	try {
		var { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, tiempoDeGestacion, activo } = body;
		const prueba = { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, tiempoDeGestacion, activo };
		if (tipo === "Grupo Sanguineo") var gruposanguineo = GrupoSanguineoServices.UpdateGrupoSanguineo(grupoSanguineo._id, grupoSanguineo);
		else if (tipo === "Identificación Anticuerpo") {
			//TODO modificar identificacion
		} else if (tipo === "Pesquizaje Anticuerpo") {
			//TODO modificar pesquizaje
		}
		const updated = await Prueba.findByIdAndUpdate(id, prueba);
		return updated;
	} catch (err) {
		throw Error("UpdateTest -> Modificando Prueba \n" + err);
	}
};
exports.DeletePrueba = async (prueba) => {
	try {
		if (prueba.tipo === "Grupo Sanguineo") {
			//eliminar Grupo Sanguineo con id
			await GrupoSanguineoServices.DeleteGrupoSanguineo(prueba);
		} else if (prueba.tipo === "Identificación Anticuerpo") {
			//TODO eliminar identificacion
		} else if (prueba.tipo === "Pesquizaje Anticuerpo") {
			//TODO eliminar pesquizaje
		}
		//eliminar prueba con id
		const removed = await Prueba.findByIdAndRemove(prueba._id);

		//se adiciona la Prueba en el Examen
		await TestServices.DeletePruebaInTest(saved);

		return removed;
	} catch (err) {
		throw Error("DeleteTest -> Eliminando Prueba \n" + err);
	}
};
exports.DeletePruebas = async (pruebas) => {
	try {
		await pruebas.forEach(async (prueba) => {
			exports.DeletePrueba(prueba);
		});
	} catch (err) {
		throw Error("DeleteTests -> Eliminando Pruebas \n" + err);
	}
};
exports.DisablePrueba = async (id, prueba) => {
	try {
		if (prueba.activo) {
			prueba.activo = false;
			//desactivar todas las pruebas del examen
			const updated = await Prueba.findByIdAndUpdate(prueba._id, prueba);
			return updated;
		} else {
			return await exports.DeletePrueba(prueba);
		}
	} catch (err) {
		throw Error("DisableTest -> Desactivando Prueba \n" + err);
	}
};
exports.DisablePruebas = async (pruebas) => {
	try {
		//desactivar todas las pruebas
		await pruebas.forEach(async (prueba) => {
			//desactivar todas las pruebas
			await exports.DisablePrueba(prueba._id, prueba);
		});
	} catch (err) {
		throw Error("DisablePruebas -> Desactivando Pruebas \n" + err);
	}
};
// exports.InsertNewDetailsInTest = async (pruebas, examen) => {
//   try {
//     pruebas.forEach((prueba) => {
//       prueba = { examen: examen };
//       if (prueba.estado === "Nueva") {
//         if (prueba.tipo === "Grupo Sanguineo") BloodGroupServices.InsertBloodGroup(prueba);
//       }
//     });
//   } catch (err) {
//     throw Error("InsertDetailsInTest -> Insertando Pruebas Nuevas en Examen \n" + err);
//   }
// };
//#endregion
