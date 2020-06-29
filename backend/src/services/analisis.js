//#region Modelos
const Examen = require("../models/models").Examen;
const Analisis = require("../models/models").Analisis;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const TestServices = require("./examen");
const GrupoSanguineoServices = require("./analisis/gruposanguineo");
//#endregion

//#region Examen
exports.GetAnalisis = async (query, page, limit) => {
	try {
		var analisis = await Analisis.find(query).populate({ path: "examen", populate: { path: "paciente" } });
		return analisis;
	} catch (err) {
		throw Error("GetAnalisis -> Obteniendo Analisis.");
	}
};
exports.GetOneAnalisis = async (id) => {
	try {
		var analisis = await Analisis.findById(id).populate({ path: "examen", populate: { path: "paciente" } });
		return analisis;
	} catch (err) {
		throw Error("GetOneAnalisis -> Obteniendo Analisis con id: " + id);
	}
};
exports.InsertAnalisis = async (body) => {
	try {
		var { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, tiempoDeGestacion, activo } = body;
		const analisis = new Analisis({
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
		var saved = await analisis.save();
		//almacenar la analisis de tipo grupo sanguineo
		if (tipo === "Grupo Sanguineo") {
			var gruposanguineo = GrupoSanguineoServices.InsertGrupoSanguineo(body, analisis);
			//actualizar la analisis asignandole el grupo sanguineo
			saved = { grupoSanguineo: gruposanguineo };
			await Analisis.findByIdAndUpdate(id, saved);
		} else if (tipo === "Identificación Anticuerpo") {
			//TODO insertar identificacion
		} else if (tipo === "Pesquizaje Anticuerpo") {
			//TODO insertar pesquizaje
		}
		//se adiciona la analisis en el Examen
		await TestServices.InsertAnalisisToTest(saved);
		return saved;
	} catch (err) {
		throw Error("InsertAnalisis -> Insertando Analisis \n" + err);
	}
};
exports.UpdateAnalisis = async (id, body) => {
	try {
		var { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, tiempoDeGestacion, activo } = body;
		const analisis = { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, tiempoDeGestacion, activo };
		if (tipo === "Grupo Sanguineo") var gruposanguineo = GrupoSanguineoServices.UpdateGrupoSanguineo(grupoSanguineo._id, grupoSanguineo);
		else if (tipo === "Identificación Anticuerpo") {
			//TODO modificar identificacion
		} else if (tipo === "Pesquizaje Anticuerpo") {
			//TODO modificar pesquizaje
		}
		const updated = await analisis.findByIdAndUpdate(id, analisis);
		return updated;
	} catch (err) {
		throw Error("UpdateAnalisis -> Modificando Analisis \n" + err);
	}
};
exports.DeleteOneAnalisis = async (analisis) => {
	try {
		if (analisis.tipo === "Grupo Sanguineo") {
			//eliminar Grupo Sanguineo con id
			await GrupoSanguineoServices.DeleteGrupoSanguineo(analisis);
		} else if (analisis.tipo === "Identificación Anticuerpo") {
			//TODO eliminar identificacion
		} else if (analisis.tipo === "Pesquizaje Anticuerpo") {
			//TODO eliminar pesquizaje
		}
		//eliminar analisis con id
		const removed = await Analisis.findByIdAndRemove(analisis._id);

		//se adiciona la analisis en el Examen
		await TestServices.DeleteAnalisisInTest(removed);

		return removed;
	} catch (err) {
		throw Error("DeleteAnalisis -> Eliminando analisis \n" + err);
	}
};
exports.DeleteAnalisis = async (analisis) => {
	try {
		await analisis.forEach(async (one) => {
			exports.DeleteOneAnalisis(one);
		});
	} catch (err) {
		throw Error("DeleteAnalisis -> Eliminando Analisis \n" + err);
	}
};
exports.DisableOneAnalisis = async (id, analisis) => {
	try {
		if (analisis.activo) {
			analisis.activo = false;
			//desactivar todas las analisis del examen
			const updated = await Analisis.findByIdAndUpdate(analisis._id, analisis);
			return updated;
		} else {
			return await exports.DeleteOneAnalisis(analisis);
		}
	} catch (err) {
		throw Error("DisableOneAnalisis -> Desactivando Analisis \n" + err);
	}
};
exports.DisableAnalisis = async (analisis) => {
	try {
		//desactivar todas las analisis
		await analisis.forEach(async (one) => {
			//desactivar todas las analisis
			await exports.DisableOneAnalisis(one._id, one);
		});
	} catch (err) {
		throw Error("DisableAnalisis -> Desactivando Analisis \n" + err);
	}
};
