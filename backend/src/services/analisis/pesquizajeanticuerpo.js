//#region Modelos
const PesquizajeAnticuerpo = require("../../models/models").PesquizajeAnticuerpo;
var mongoose = require("mongoose");
//#endregion

//#region Servicios
//#endregion

//#region PesquizajeAnticuerpo
exports.GetPesquizajesAnticuerpo = async (query, page, limit) => {
	try {
		var pesquizajesAnticuerpo = await PesquizajeAnticuerpo.find(query).populate({ path: "analisis", populate: { path: "examen" } });
		return pesquizajesAnticuerpo;
	} catch (err) {
		throw Error("GetPesquizajesAnticuerpo -> Obteniendo Pesquizajes de Anticuerpo.");
	}
};
exports.GetPesquizajeAnticuerpo = async (id) => {
	try {
		var pesquizajesAnticuerpo = await PesquizajeAnticuerpo.findById(id).populate({ path: "analisis", populate: { path: "examen" } });
		return pesquizajesAnticuerpo;
	} catch (err) {
		throw Error("GetPesquizajeAnticuerpo -> Obteniendo Pesquizaje de Anticuerpo con id: " + id);
	}
};
exports.InsertPesquizajeAnticuerpo = async (analisis) => {
	try {
		//creando
		const pesquizajesAnticuerpo = new PesquizajeAnticuerpo({
			celula1: null,
			celula2: null,
			celula3: null,
			pCoomsIndirecto: null, //{resultadocelula1, resultadocelula2, resultadocelula3, resultadofinal}
			pSalina4g: null, //{resultadocelula1, resultadocelula2, resultadocelula3, resultadofinal}
			pSalina37g: null, //{resultadocelula1, resultadocelula2, resultadocelula3, resultadofinal}
			analisis: analisis._id,
		});
		//salvando
		const saved = await pesquizajesAnticuerpo.save();
		return saved;
	} catch (err) {
		throw Error("InsertPesquizajeAnticuerpo -> Insertando Pesquizaje de Anticuerpo \n" + err);
	}
};
exports.UpdatePesquizajeAnticuerpo = async (id, body) => {
	try {
		var { celula1, celula2, celula3, pCoomsIndirecto, pSalina4g, pSalina37g } = body;
		const pesquizajesAnticuerpo = { celula1, celula2, celula3, pCoomsIndirecto, pSalina4g, pSalina37g };
		const updated = await PesquizajeAnticuerpo.findByIdAndUpdate(id, pesquizajesAnticuerpo);
		return updated;
	} catch (err) {
		throw Error("UpdatePesquizajeAnticuerpo -> Modificando Pesquizaje de Anticuerpo \n" + err);
	}
};
exports.DeletePesquizajeAnticuerpo = async (pesquizajesAnticuerpo) => {
	try {
		const removed = await PesquizajeAnticuerpo.findByIdAndRemove(pesquizajesAnticuerpo._id);
		return removed;
	} catch (err) {
		throw Error("DeleteGrupoSanguineo -> Eliminando Pesquizaje de Anticuerpo \n" + err);
	}
};
//#endregion
