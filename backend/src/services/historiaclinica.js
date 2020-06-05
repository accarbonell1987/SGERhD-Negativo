//#region Modelos
const HistoriaClinica = require('../models/models').HistoriaClinica;
var mongoose = require('mongoose');
//#endregion

//#Servicios
const PatientService = require('../services/patients');
//#endregion

//#region HistoriaClinicas
exports.GetClinicsHistory = async (query, page, limit) => {
    try {
        var clinicshistory = await HistoriaClinica.find(query).populate({ path:'paciente', populate: {path: 'transfusiones'} });
        return clinicshistory;
    } catch (err) {
        console.log('Error: Obteniendo Historias Clinicas');
        throw Error('Obteniendo Historias Clinicas');
    }
}
exports.GetClinicHistory = async (id) => {
    try {
        var clinichistory = await HistoriaClinica.findById(id).populate({ path:'paciente', populate: {path: 'transfusiones'} });
        return clinichistory;
    } catch (err) {
        console.log('Error: Obteniendo Historia Clinica con id: ' + id);
        throw Error('Obteniendo Historia Clinica con id: ' + id);
    }
}
exports.GetClinicHistoryLastInserted = async () => {
    try {
        var clinichistory = await HistoriaClinica.find().sort({ _id: -1}).limit(1);
        return clinichistory;
        // return null;
    } catch(err) {
        console.log('Error: Obteniendo Ultimo');
        throw Error('Obteniendo Ultimo');
    }
}
exports.InsertClinicHistory = async (body) => {
    try {
        const { fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = body;

        const clinichistory = new HistoriaClinica({ fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo });
        
        await HistoriaClinica.findOne({ paciente: paciente })
            .then(doc => {
                if (doc === null) {
                    const saved = clinichistory.save();
                    return saved;
                } else throw Error('HistoriaClinica ya existente');
            })
            .then(saved => {
                PatientService.UpdatePatientClinicHistory(paciente, saved);
            })
            .catch(err => {
                console.log('Error: Insertando HistoriaClinica: ' + err);
                throw Error('Insertando HistoriaClinica: ' + err);
            });
    } catch(err) {
        console.log('Error: Insertando HistoriaClinica: ' + err);
        throw Error('Insertando HistoriaClinica: ' + err);
    };
}
exports.UpdateClinicHistory = async (id, body) => {
    try {
        const { fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = body;

        const clinichistory = { fechaDeCreacion, areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo };

        var updated = await HistoriaClinica.findByIdAndUpdate(id, clinichistory);
        return updated;
    } catch(err) {
        console.log('Error: Modificando HistoriaClinica: ' + err);
        throw Error('Modificando HistoriaClinica: ' + err);
    }
}
exports.DeleteClinicHistory = (clinichistory) => {
    var removed = HistoriaClinica.findByIdAndRemove(clinichistory._id)
        .then(removed => removed)
        .then(p => {
            PatientService.DeleteClinicHistoryInPatient(clinichistory);
        })
        .catch(err => {
            console.log('Error: Eliminando Historia Clinica' + err);
            throw Error('Eliminando Historia Clinica: ' + err);
        });
    return removed;
}
exports.DeleteClinicHistoryFromPatient = (patient) => {
    var removed = HistoriaClinica.findByIdAndRemove(patient.historiaclinica)
        .then(removed => removed)
        .catch(err => {
            console.log('Error: (DeleteClinicHistoryFromPatient) Eliminando Historia Clinica' + err);
            throw Error('(DeleteClinicHistoryFromPatient) Eliminando Historia Clinica: ' + err);
        });
    return removed;
}
exports.DisableClinicHistory = async (id, clinichistory) => {
    if (clinichistory.activo ) {
        clinichistory = { activo: false };
        var updated = HistoriaClinica.findByIdAndUpdate(id, clinichistory)
        .then(clinichistory => clinichistory)
        .catch(err => {
            console.log('Error: Desactivando Historia Clinica: ' + err);
            throw Error('Desactivando Historia Clinica: ' + err);
        });
        return updated;
    }else{
        return exports.DeleteClinicHistory(clinichistory);
    }
}
//#endregion