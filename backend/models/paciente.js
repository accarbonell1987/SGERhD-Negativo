//requerido
var mongoose = required('mongoose');

var Transfusion = required('./transfusion.js');
var Embarazo = required('./embarazo.js');
var Examen = required('./examen.js');

//var Library = require('./library.js'),  Author = require('./author.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var paciente_schema = new Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    ci: { type: String, required: true, minlength:11, maxlength:11 },
    direccion: { type: String, required: true },
    telefono: {type: Number },
    areaDeSalud: { type: String },
    madre: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    hijos: [{ type: Schema.Types.ObjectId, ref: 'Paciente' }],
    transfusiones: [{ type: Schema.Types.ObjectId, ref: 'Transfusion' }],
    embarazos: [{ type: Schema.Types.ObjectId, ref: 'Embarazo' }],
    examen: [{ type: Schema.Types.ObjectId, ref: 'Examen' }],
    accessToken: { type: String }
});

//virtuals
paciente_schema.virtual('nombre_completo').get(function(){
    return this.nombre + ' ' + this.apellidos;
});

//exportacion del modelo
var paciente = mongoose.model('Paciente', paciente_schema);

module.exports.paciente = paciente;