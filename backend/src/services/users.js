//#region Modelos
const Usuario = require("../models/models").Usuario;
//#endregion

//#region Servicios
const LogServices = require("../services/logs");
//#endregion

//#region Usuarios
exports.GetUsers = async (query, page, limit) => {
	try {
		const users = await Usuario.find(query).populate("logs");
		return users;
	} catch (err) {
		throw Error("GetUsers -> Obteniendo Usuarios.");
	}
};
exports.GetUser = async (id) => {
	try {
		const user = await Usuario.findById(id).populate("logs");
		return users;
	} catch (err) {
		throw Error("GetUser -> Obteniendo Usuario con id: " + id);
	}
};
exports.InsertUser = async (body) => {
	try {
		const { nombre, contraseña, rol, email, activo } = body;
		const user = new Usuario({ nombre, contraseña, rol, email, activo });
		const modeluser = await Usuario.findOne({ nombre: nombre });
		if (modeluser == null) {
			const saved = await user.save();
			return saved;
		} else throw Error("Usuario ya existente");
	} catch (err) {
		throw Error("InsertUser -> Insertando Usuario \n" + err);
	}
};
exports.InserLogToUser = async (log) => {
	try {
		var usuario = await Usuario.findById(log.usuario);
		await usuario.logs.push(log);
		const saved = await usuario.save();
		return saved;
	} catch (err) {
		throw Error("InserLogToUser -> Insertando Log en Usuario \n" + err);
	}
};
exports.UpdateUser = async (id, body) => {
	try {
		const { email, rol, activo } = body;
		const user = { email, rol, activo };
		var updated = await Usuario.findByIdAndUpdate(id, user);
		return updated;
	} catch (err) {
		throw Error("UpdateUser -> Modificando Usuario \n" + err);
	}
};
exports.UpdateUserPassword = async (id, body) => {
	const { contraseña } = body;
	const user = { contraseña };
	try {
		var updated = await Usuario.findByIdAndUpdate(id, user);
		return updated;
	} catch (err) {
		throw Error(
			"UpdateUserPassword -> Modificando Contraseña Usuario \n" + err
		);
	}
};
exports.DeleteUser = async (id) => {
	try {
		const removed = await Usuario.findByIdAndRemove(id);
		const deleted = await LogServices.DeleteLogByUserId(id);
		return removed;
	} catch (err) {
		throw Error("DeleteUser -> Eliminando Usuario \n" + err);
	}
};
exports.DisableUser = async (id, user) => {
	try {
		if (user.activo) {
			user = { activo: false };
			var updated = await Usuario.findByIdAndUpdate(id, user);
			return updated;
		} else {
			return await exports.DeleteUser(id);
		}
	} catch (err) {
		throw Error("DisableUser -> Modificando Usuario \n" + err);
	}
};
//#endregion
