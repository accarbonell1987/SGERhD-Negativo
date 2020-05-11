//requerido
var mongoose = required('mongoose');

var Paciente = required('./paciente.js');
var Examen = required('./examen.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var embarazo_schema = new Schema({
    fecha: { type: Date, required: true },
    tiempoDeGestacion: { type: Number, required: true},
    observaciones: { type: String },
    examenes: [{ type: Schema.Types.ObjectId, ref: 'Examen' }],
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    accessToken: { type: String }
});

//exportacion del modelo
var embarazo = mongoose.model('Embarazo', embarazo_schema);

module.exports.embarazo = embarazo;