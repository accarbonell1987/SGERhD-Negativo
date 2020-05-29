//#region Modelos
const Usuario = require('../models/models').Usuario;
//#endregion

//#Servicios
const LogServices = require('../services/logs');
//#endregion

//#region Usuarios
exports.GetUsers = async (query, page, limit) => {
    try {
        var users = await Usuario.find(query);

        // users.forEach((element, index, users) => {
        //     var logs = LogServices.GetLogByUserId(element._id);
        //     console.log(logs);
        // });

        return users;
    } catch (err) {
        console.log('Error: Obteniendo Usuarios');
        throw Error('Obteniendo Usuarios');
    }
}
exports.GetUser = async (id) => {
    try {
        var user = await Usuario.findById(id);
        return user;
    } catch (err) {
        console.log('Error: Obteniendo Usuario con id: ' + id);
        throw Error('Obteniendo Usuario con id: ' + id);
    }
}
exports.InsertUser = async (body) => {
    const { nombre, contraseña, rol, email, activo } = body;
    const user = new Usuario({ nombre, contraseña, rol, email, activo });
    try {
        await Usuario.findOne({ nombre: nombre })
            .then(doc => {
                if (doc === null) {
                    const saved = user.save();
                    return saved;
                } else throw Error('Usuario ya existente');
            }).catch(err => {
                console.log('Error: Insertando Usuario: ' + err);
                throw Error('Insertando Usuario: ' + err);
            });
    } catch(err) {
        console.log('Error: Insertando Usuario: ' + err);
        throw Error('Insertando Usuario: ' + err);
    };
}
exports.DeleteUser = async (id) => {
    try {
        var removed = await Usuario.findByIdAndRemove(id);
        return removed;
    } catch(err) {
        console.log('Error: Eliminando Usuarios' + err);
        throw Error('Eliminando Usuario: ' + err);
    };
}
exports.UpdateUser = async (id, body) => {
    const { email, rol, activo } = body;
    const user = { email, rol, activo };
    try {
        var updated = await Usuario.findByIdAndUpdate(id, user);
        return updated;
    } catch(err) {
        console.log('Error: Modificando Usuario: ' + err);
        throw Error('Modificando Usuario: ' + err);
    }
}
exports.UpdateUserPassword = async (id, body) => {
    const { contraseña } = body;
    const user = { contraseña };
    try {
        var updated = await Usuario.findByIdAndUpdate(id, user);
        return updated;
    } catch(err) {
        console.log('Error: Modificando Contraseña Usuario: ' + err);
        throw Error('Modificando Contraseña Usuario: ' + err);
    }
}

//#endregion