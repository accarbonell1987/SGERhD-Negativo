//requeridos
var mongoose = required('mongoose');
var Paciente = require('./paciente.js');

//var Library = require('./library.js'),  Author = require('./author.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var historiaclinica_schema = new Schema({
    fechaDeCreacion: { type: Date, require: true },
    numero: { type: Number, require: true },
    vacunaAntiD: { type: Boolean },
    numeroDeEmbarazos: { type: Number, min: 0 },
    numeroDePartos: { type: Number, min: 0 },
    numeroDeAbortos: { type: Number, min: 0 },
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    accessToken: { type: String }
});

//exportacion del modelo
var historiaclinica = mongoose.model('HistoriaClinica', historiaclinica_schema);

module.exports.historiaclinica = historiaclinica;