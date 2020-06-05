//#region Modelos
const Paciente = require('../models/models').Paciente;
var mongoose = require('mongoose');
//#endregion

//#Servicios
const ClinicHistoryService = require('../services/historiaclinica');
//#endregion

//#region Pacientes
exports.GetPatients = async (query, page, limit) => {
    try {
        var patients = await Paciente.find(query).populate('historiaclinica').populate('madre').populate('transfusiones');
        return patients;
    } catch (err) {
        console.log('Error: Obteniendo Pacientes');
        throw Error('Obteniendo Pacientes');
    }
}
exports.GetPatient = async (id) => {
    try {
        var patient = await Paciente.findById(id).populate('historiaclinica').populate('madre').populate('transfusiones');
        return patient;
    } catch (err) {
        console.log('Error: Obteniendo Paciente con id: ' + id);
        throw Error('Obteniendo Paciente con id: ' + id);
    }
}
exports.InsertPatient = async (body) => {
    try {
        var { fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, transfusiones, embarazos, examenes, activo } = body;

        const patient = new Paciente({ fechaDeCreacion, nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, transfusiones, embarazos, examenes, activo });
        
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

exports.UpdatePatient = async (id, body) => {
    try {
        const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, transfusiones, embarazos, examenes, activo, hijoseliminados } = body;

        const patient = { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, transfusiones, embarazos, examenes, activo };
        
        console.log(hijos);
        //asignarle el madre al hijo correspondiente
        if (hijos != null) {
            hijos.map(hijo => {
                Paciente.findById(hijo)
                .then(hijo => {
                    if (sexo === 'F') hijo.madre = id;
                    const saved = hijo.save();
                });
            });
        }
        //asignar null al hijo correspondiente
        if (hijoseliminados != null) {
            //eliminar la madre al hijo
            hijoseliminados.map(hijo => {
                Paciente.findById(hijo)
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
exports.DisablePatient = (id, patient) => {
    if (patient.activo ) {
        patient = { activo: false };
        var updated = Paciente.findByIdAndUpdate(id, patient)
        .then(patient => patient)
        .then(patient => {
            //desactivar todo lo que tiene que ver con el paciente
            //transfusiones, examenes, historiaclinica, embarazos
        })
        .catch(err => {
            console.log('Error: Modificando Paciente: ' + err);
            throw Error('Modificando Paciente: ' + err);
        });
        return updated;
    }else{
        return exports.DeletePatient(patient);
    }
}
exports.UpdatePatientClinicHistory = async (id, clinichistory) => {
    try {
        const patient = { historiaclinica: clinichistory };
        var updated = await Paciente.findByIdAndUpdate(id, patient);
        return updated;
    } catch(err) {
        console.log('Error: (UpdatePatientClinicHistory) Modificando Paciente: ' + err);
        throw Error('(UpdatePatientClinicHistory) Modificando Paciente: ' + err);
    }
}
exports.InsertTranToPatient = (tran) => {
    try {
        Paciente.findById(tran.paciente).then(p => {
            p.transfusiones.push(tran);
            const saved = p.save();
            return saved;
        });
    } catch(err) {
        console.log('Error: Insertando Transfusion en Paciente: ' + err);
        throw Error('Insertando Transfusion en Paciente: ' + err);
    }
}
exports.DeletePatient = (patient) => {
    var removed = Paciente.findByIdAndRemove(patient._id)
        .then(removed => removed)
        .then(p => {
            //eliminar todo lo que tiene que ver con el paciente
            //transfusiones, examenes, historiaclinica, embarazos
            ClinicHistoryService.DeleteClinicHistoryFromPatient(patient);
        })
        .catch(err => {
            console.log('Error: Eliminando Paciente' + err);
            throw Error('Eliminando Paciente: ' + err);
        });
    return removed;
}
exports.DeleteTranInPatient = (tran) => {
    var paciente = tran.paciente;
    //buscar el indice del elemento que representa esa transaccion en el arreglo de transacciones del paciente
    let index = paciente.transfusiones.indexOf(tran._id);
    //eliminar del arreglo el elemento
    let item = paciente.transfusiones.splice(index, 1);
    //hacer un update del paciente
    const patient = { transfusiones: item };
    var updated = Paciente.findByIdAndUpdate(paciente._id, patient)
        .then(updated => updated)
        .catch(err => {
            console.log('Error: DeleteTranFromPatient Transfusion en Paciente: ' + err);
            throw Error('DeleteTranFromPatient Transfusion en Paciente: ' + err);
        });
    return updated;
}
exports.DeleteClinicHistoryInPatient = (clinichistory) => {
    var paciente = clinichistory.paciente;
    const patient  = { historiaclinica: new mongoose.ObjectId() };
    var updated = Paciente.findByIdAndUpdate(paciente._id, patient)
        .then(updated => updated)
        .catch(err => {
            console.log('Error: DeleteClinicHistoryInPatient Transfusion en Paciente: ' + err);
            throw Error('DeleteClinicHistoryInPatient Transfusion en Paciente: ' + err);
        });
    return updated;
}
//#endregion