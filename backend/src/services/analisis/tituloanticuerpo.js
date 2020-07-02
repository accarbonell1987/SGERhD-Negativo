//#region Modelos
const TituloAnticuerpo = require("../../models/models").TituloAnticuerpo;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
//#endregion

//#region TituloAnticuerpo
exports.GetTodosTitulosAnticuerpos = async (query, page, limit) => {
	try {
		var titulosAnticuerpos = await TituloAnticuerpo.find(query).populate({ path: "analisis", populate: { path: "examen" } });
		return titulosAnticuerpos;
	} catch (err) {
		throw Error("GetTodosTitulosAnticuerpos -> Obteniendo Titulos Anticuerpos.");
	}
};
exports.GetTituloAnticuerpo = async (id) => {
	try {
		var tituloAnticuerpo = await TituloAnticuerpo.findById(id).populate({ path: "analisis", populate: { path: "examen" } });
		return tituloAnticuerpo;
	} catch (err) {
		throw Error("GetTituloAnticuerpo -> Obteniendo Titulo Anticuerpo con id: " + id);
	}
};
exports.InsertTituloAnticuerpo = async (analisis) => {
	try {
		//creando grupo sanguineo
		const tituloAnticuerpo = new TituloAnticuerpo({
			celula: null,
			diluciones: null,
			bajaconcentracion: null,
			referenciaIdentificacion: null,
			analisis: analisis._id,
		});
		//salvando el grupo sanguineo
		const saved = await TituloAnticuerpo.save();
		return saved;
	} catch (err) {
		throw Error("InsertTituloAnticuerpo -> Insertando Titulo Anticuerpo \n" + err);
	}
};
exports.UpdateTituloAnticuerpo = async (id, body) => {
	try {
		var { celula, diluciones, bajaconcentracion, referenciaIdentificacion } = body;
		const tituloAnticuerpo = { celula, diluciones, bajaconcentracion, referenciaIdentificacion };
		const updated = await TituloAnticuerpo.findByIdAndUpdate(id, tituloAnticuerpo);
		return updated;
	} catch (err) {
		throw Error("UpdateTituloAnticuerpo -> Modificando Titulo Anticuerpo\n" + err);
	}
};
exports.DeleteTituloAnticuerpo = async (tituloAnticuerpo) => {
	try {
		const removed = await TituloAnticuerpo.findByIdAndRemove(tituloAnticuerpo._id);
		return removed;
	} catch (err) {
		throw Error("DeleteTituloAnticuerpo -> Eliminando Titulo Anticuerpo\n" + err);
	}
};
//#endregion
