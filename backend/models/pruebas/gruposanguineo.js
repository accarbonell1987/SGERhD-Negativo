//requerido
var mongoose = required('mongoose');

var Examen = required('../examen.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var gruposanguineo_schema = new Schema({
    fecha: { type: Date, required: true },
    dDebil : { type: String },
    gSanguineo : { type: String },
    factor : { type: String },
    examen: { type: Schema.Types.ObjectId, ref: 'Examen' },
    accessToken: { type: String }
});

//exportacion del modelo
var gruposanguineo = mongoose.model('GrupoSanguineo', gruposanguineo_schema);

module.exports.gruposanguineo = gruposanguineo;