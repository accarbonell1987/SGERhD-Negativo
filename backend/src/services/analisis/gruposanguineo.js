//#region Modelos
const GrupoSanguineo = require("../../models/models").GrupoSanguineo;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
//#endregion

//#region GrupoSanguineo
exports.GetTodosGrupoSanguineos = async (query, page, limit) => {
	try {
		var GrupoSanguineos = await GrupoSanguineo.find(query).populate({ path: "analisis", populate: { path: "examen" } });
		return GrupoSanguineos;
	} catch (err) {
		throw Error("GetGrupoSanguineos -> Obteniendo Grupos Sanguineo.");
	}
};
exports.GetGrupoSanguineo = async (id) => {
	try {
		var GrupoSanguineo = await GrupoSanguineo.findById(id).populate({ path: "analisis", populate: { path: "examen" } });
		return GrupoSanguineo;
	} catch (err) {
		throw Error("GetGrupoSanguineo -> Obteniendo Grupo Sanguineo con id: " + id);
	}
};
exports.InsertGrupoSanguineo = async (analisis) => {
	try {
		console.log("InsertGrupoSanguineo ->", analisis);
		//creando grupo sanguineo
		const gruposanguineo = new GrupoSanguineo({
			dDebil: null,
			gSanguineo: null,
			factor: null,
			analisis: analisis._id,
		});
		//salvando el grupo sanguineo
		const saved = await gruposanguineo.save();
		return saved;
	} catch (err) {
		throw Error("InsertGrupoSanguineo -> Insertando Grupo Sanguineo \n" + err);
	}
};
exports.UpdateGrupoSanguineo = async (id, body) => {
	try {
		var { dDebil, gSanguineo, factor } = body;
		const gruposanguineo = { dDebil, gSanguineo, factor };
		const updated = await GrupoSanguineo.findByIdAndUpdate(id, gruposanguineo);
		return updated;
	} catch (err) {
		throw Error("UpdateGrupoSanguineo -> Modificando Grupo Sanguineo \n" + err);
	}
};
exports.DeleteGrupoSanguineo = async (gruposanguineo) => {
	try {
		const removed = await GrupoSanguineo.findByIdAndRemove(gruposanguineo._id);
		return removed;
	} catch (err) {
		throw Error("DeleteGrupoSanguineo -> Eliminando Grupo Sanguineo \n" + err);
	}
};
//#endregion
