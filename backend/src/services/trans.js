//#region Modelos
const Transfusion = require('../models/models').Transfusion;
var mongoose = require('mongoose');
//#endregion

//#region Transfusiones
exports.GetTrans = async (query, page, limit) => {
    try {
        var trans = await Transfusion.find(query).populate('paciente');
        return trans;
    } catch (err) {
        console.log('Error: Obteniendo Transfusiones');
        throw Error('Obteniendo Transfusiones');
    }
}
exports.GetTran = async (id) => {
    try {
        console.log(id);
        var tran = await Transfusion.findById(id).populate('paciente');
        return tran;
    } catch (err) {
        console.log('Error: Obteniendo Transfusion con id: ' + id);
        throw Error('Obteniendo Transfusion con id: ' + id);
    }
}
exports.InsertTran = async (body) => {
    try {
        var { fecha, observaciones, reacionAdversa, paciente, activo } = body;

        const tran = new Transfusion({ fecha, observaciones, reacionAdversa, paciente, activo });
        
        await Transfusion.findOne({ paciente: paciente, fecha: fecha })
            .then(doc => {
                if (doc === null) {
                    const saved = tran.save();
                    return saved;
                } else throw Error('Transfusion ya existente');
            }).catch(err => {
                console.log('Error: Insertando Transfusion: ' + err);
                throw Error('Insertando Transfusion: ' + err);
            });
    } catch(err) {
        console.log('Error: Insertando Transfusion: ' + err);
        throw Error('Insertando Transfusion: ' + err);
    };
}
exports.DeleteTran = async (id) => {
    try {
        var removed = await Transfusion.findByIdAndRemove(id);
        return removed;
    } catch(err) {
        console.log('Error: Eliminando Transfusion' + err);
        throw Error('Eliminando Transfusion: ' + err);
    };
}
exports.UpdateTran = async (id, body) => {
    try {
        var { fecha, observaciones, reacionAdversa, paciente, activo } = body;
        const tran = { fecha, observaciones, reacionAdversa, paciente,  activo };

        var updated = await Transfusion.findByIdAndUpdate(id, tran);
        return updated;
    } catch(err) {
        console.log('Error: Modificando Transfusion: ' + err);
        throw Error('Modificando Transfusion: ' + err);
    }
}
//#endregion