//requerido
var mongoose = required('mongoose');
var Paciente = required('./paciente.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var transfusion_schema = new Schema({
    fecha: {type: Date, required: true },
    observaciones: { type: String },
    reacionAdversa: { type: Boolean },
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    accessToken: { type: String }
});

//exportacion del modelo
var transfusion = mongoose.model('Transfusion', transfusion_schema);

module.exports.transfusion = transfusion;