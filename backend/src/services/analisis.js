//#region Modelos
const Examen = require("../models/models").Examen;
const Analisis = require("../models/models").Analisis;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
const TestServices = require("./examen");
const GrupoSanguineoServices = require("./analisis/gruposanguineo");
const PesquizajeAnticuerpoServices = require("./analisis/pesquizajeanticuerpo");
const IdentificacionAnticuerpoServices = require("./analisis/identificacionanticuerpo");
//#endregion

//#region Examen
exports.GetAnalisis = async (query, page, limit) => {
	try {
		var analisis = await Analisis.find(query)
			.populate({ path: "examen", populate: { path: "paciente" } })
			.populate({ path: "examen", populate: { path: "embarazo" } })
			.populate("grupoSanguineo");
		return analisis;
	} catch (err) {
		throw Error("GetAnalisis -> Obteniendo Analisis.");
	}
};
exports.GetOneAnalisis = async (id) => {
	try {
		var analisis = await Analisis.findById(id)
			.populate({ path: "examen", populate: { path: "paciente" } })
			.populate({ path: "examen", populate: { path: "embarazo" } })
			.populate("grupoSanguineo");
		return analisis;
	} catch (err) {
		throw Error("GetOneAnalisis -> Obteniendo Analisis con id: " + id);
	}
};
exports.GetLastInserted = async () => {
	try {
		var analisis = await Analisis.find().sort({ _id: -1 }).limit(1);
		return analisis;
		// return null;
	} catch (err) {
		throw Error("GetLastInserted -> Obteniendo Ultimo");
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
			var gruposanguineo = await GrupoSanguineoServices.InsertGrupoSanguineo(saved);
			//actualizar la analisis asignandole el grupo sanguineo
			saved.grupoSanguineo = gruposanguineo;
			await Analisis.findByIdAndUpdate(saved._id, saved);
		} else if (tipo === "Identificación Anticuerpo") {
			var indetificacionAnticuerpo = await IdentificacionAnticuerpoServices.InsertIdentificacionAnticuerpo(saved);
			//actualizar la analisis asignandole el grupo sanguineo
			saved.indetificacionAnticuerpo = indetificacionAnticuerpo;
			await Analisis.findByIdAndUpdate(saved._id, saved);
		} else if (tipo === "Pesquizaje Anticuerpo") {
			var pesquizajeAnticuerpo = await PesquizajeAnticuerpoServices.InsertPesquizajeAnticuerpo(saved);
			//actualizar la analisis asignandole el grupo sanguineo
			saved.pesquizajeAnticuerpo = pesquizajeAnticuerpo;
			await Analisis.findByIdAndUpdate(saved._id, saved);
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
		const updated = await Analisis.findByIdAndUpdate(id, analisis);
		return updated;
	} catch (err) {
		throw Error("UpdateAnalisis -> Modificando Analisis \n" + err);
	}
};
exports.DeleteOneAnalisis = async (analisis) => {
	try {
		if (analisis.tipo === "Grupo Sanguineo") {
			//eliminar Grupo Sanguineo con id
			await GrupoSanguineoServices.DeleteGrupoSanguineo(analisis.grupoSanguineo);
		} else if (analisis.tipo === "Identificación Anticuerpo") {
			await IdentificacionAnticuerpoServices.DeleteIdentificacionAnticuerpo(analisis.identificacionAnticuerpo);
		} else if (analisis.tipo === "Pesquizaje Anticuerpo") {
			await PesquizajeAnticuerpoServices.DeletePesquizajeAnticuerpo(analisis.pesquizajeAnticuerpo);
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
