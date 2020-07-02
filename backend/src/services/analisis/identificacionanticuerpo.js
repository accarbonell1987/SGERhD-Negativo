//#region Modelos
const IdentificacionAnticuerpo = require("../../models/models").IdentificacionAnticuerpo;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
//#endregion

//#region IdentificacionAnticuerpo
exports.GetIdentificacionsAnticuerpo = async (query, page, limit) => {
	try {
		var identificacionesAnticuerpo = await IdentificacionAnticuerpo.find(query).populate({ path: "analisis", populate: { path: "examen" } });
		return identificacionesAnticuerpo;
	} catch (err) {
		throw Error("GetIdentificacionsAnticuerpo -> Obteniendo Identificacions de Anticuerpo.");
	}
};
exports.GetIdentificacionAnticuerpo = async (id) => {
	try {
		var identificacionsAnticuerpo = await IdentificacionAnticuerpo.findById(id).populate({ path: "analisis", populate: { path: "examen" } });
		return identificacionsAnticuerpo;
	} catch (err) {
		throw Error("GetIdentificacionAnticuerpo -> Obteniendo Identificacion de Anticuerpo con id: " + id);
	}
};
exports.InsertIdentificacionAnticuerpo = async (analisis) => {
	try {
		//creando
		const identificacionsAnticuerpo = new IdentificacionAnticuerpo({
			pCoombsIndirecto: null,
			pSalina4g: null,
			pSalina37g: null,
			referenciaPesquizaje: null,
			analisis: analisis._id,
		});
		//salvando
		const saved = await identificacionsAnticuerpo.save();
		return saved;
	} catch (err) {
		throw Error("InsertIdentificacionAnticuerpo -> Insertando Identificacion de Anticuerpo \n" + err);
	}
};
exports.UpdateIdentificacionAnticuerpo = async (id, body) => {
	try {
		var { pCoombsIndirecto, pSalina4g, pSalina37g, referenciaPesquizaje } = body;
		const identificacionsAnticuerpo = { pCoombsIndirecto, pSalina4g, pSalina37g, referenciaPesquizaje };
		const updated = await IdentificacionAnticuerpo.findByIdAndUpdate(id, identificacionsAnticuerpo);
		return updated;
	} catch (err) {
		throw Error("UpdateIdentificacionAnticuerpo -> Modificando Identificacion de Anticuerpo \n" + err);
	}
};
exports.DeleteIdentificacionAnticuerpo = async (identificacionsAnticuerpo) => {
	try {
		const removed = await IdentificacionAnticuerpo.findByIdAndRemove(identificacionsAnticuerpo._id);
		return removed;
	} catch (err) {
		throw Error("DeleteIdentificacionAnticuerpo -> Eliminando Identificacion de Anticuerpo \n" + err);
	}
};
//#endregion
