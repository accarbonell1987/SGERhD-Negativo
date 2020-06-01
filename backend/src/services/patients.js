//#region Modelos
const Paciente = require('../models/models').Paciente;
var mongoose = require('mongoose');
//#endregion

//#region Pacientes
exports.GetPatients = async (query, page, limit) => {
    try {
        var patients = await Paciente.find(query);
        return patients;
    } catch (err) {
        console.log('Error: Obteniendo Pacientes');
        throw Error('Obteniendo Pacientes');
    }
}
exports.GetPatient = async (id) => {
    try {
        var patient = await Paciente.findById(id);
        return patient;
    } catch (err) {
        console.log('Error: Obteniendo Paciente con id: ' + id);
        throw Error('Obteniendo Paciente con id: ' + id);
    }
}
exports.InsertPatient = async (body) => {
    try {
        var { fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones, embarazos, examenes, activo } = body;

        const patient = new Paciente({ fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones,embarazos, examenes, activo });
        
        await Paciente.findOne({ ci: ci })
            .then(doc => {
                if (doc === null) {
                    const saved = patient.save();
                    return saved;
                } else throw Error('Paciente ya existente');
            }).catch(err => {
                console.log('Error: Insertando Paciente: ' + err);
                throw Error('Insertando Paciente: ' + err);
            });
    } catch(err) {
        console.log('Error: Insertando Paciente: ' + err);
        throw Error('Insertando Paciente: ' + err);
    };
}
exports.DeletePatient = async (id) => {
    try {
        var removed = await Paciente.findByIdAndRemove(id);
        return removed;
    } catch(err) {
        console.log('Error: Eliminando Pacientes' + err);
        throw Error('Eliminando Paciente: ' + err);
    };
}
exports.UpdatePatient = async (id, body) => {
    try {
        const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones, embarazos, examenes, activo, hijoseliminados } = body;

        const patient = { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, padre, hijos, transfusiones,embarazos, examenes, activo };

        console.log(hijos + ' - ' + hijoseliminados);

        //asignarle el padre o madre al hijo correspondiente
        if (hijos != null) {
            hijos.map(pacienteid => {
                Paciente.findById(pacienteid)
                .then(hijo => {
                    if (sexo === 'F') hijo.madre = req.params.id;
                    const saved = hijo.save();
                });
            });
        }
        //asignar null al padre o hijo correspondiente
        if (hijoseliminados != null) {
            //eliminar el padre o madre al hijo
            hijoseliminados.map(pacienteid => {
                Paciente.findById(pacienteid)
                .then(hijo => {
                    if (sexo === 'F') hijo.madre = mongoose.mongo.ObjectID();
                    const saved = hijo.save();
                });
            });
        }

        var updated = await Paciente.findByIdAndUpdate(id, patient);
        return updated;
    } catch(err) {
        console.log('Error: Modificando Paciente: ' + err);
        throw Error('Modificando Paciente: ' + err);
    }
}
//#endregion