//#region Modelos
const Usuario = require("../models/models").Usuario;
//#endregion

//#Servicios
const LogServices = require("../services/logs");
//#endregion

//#region Usuarios
exports.GetUsers = async (query, page, limit) => {
	try {
		const users = await Usuario.find(query).populate("logs");
		return users;
	} catch (err) {
		console.log("Error: Obteniendo Usuarios");
		throw Error("Obteniendo Usuarios");
	}
};
exports.GetUser = async (id) => {
	try {
		const user = await Usuario.findById(id).populate("logs");
		return users;
	} catch (err) {
		console.log("Error: Obteniendo Usuario con id: " + id);
		throw Error("Obteniendo Usuario con id: " + id);
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
		console.log("Error: Insertando Usuario: " + err);
		throw Error("Insertando Usuario: " + err);
	}
};
exports.InserLogToUser = async (log) => {
	try {
		var usuario = await Usuario.findById(log.usuario);
		await usuario.logs.push(log);
		const saved = await usuario.save();
		return saved;
	} catch (err) {
		console.log("Error: Insertando Log en Usuario: " + err);
		throw Error("Insertando Log en Usuario: " + err);
	}
};
exports.UpdateUser = async (id, body) => {
	try {
		const { email, rol, activo } = body;
		const user = { email, rol, activo };
		var updated = await Usuario.findByIdAndUpdate(id, user);
		return updated;
	} catch (err) {
		console.log("Error: Modificando Usuario: " + err);
		throw Error("Modificando Usuario: " + err);
	}
};
exports.UpdateUserPassword = async (id, body) => {
	const { contraseña } = body;
	const user = { contraseña };
	try {
		var updated = await Usuario.findByIdAndUpdate(id, user);
		return updated;
	} catch (err) {
		console.log("Error: Modificando Contraseña Usuario: " + err);
		throw Error("Modificando Contraseña Usuario: " + err);
	}
};
exports.DeleteUser = async (id) => {
	try {
		const removed = await Usuario.findByIdAndRemove(id);
		const deleted = await LogServices.DeleteLogByUserId(id);
		return removed;
	} catch (err) {
		console.log("Error: Eliminando Usuario" + err);
		throw Error("Eliminando Usuario: " + err);
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
		console.log("Error: Modificando Usuario: " + err);
		throw Error("Modificando Usuario: " + err);
	}
};
//#endregion
