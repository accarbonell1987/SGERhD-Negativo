//requerido
var mongoose = required('mongoose');

var Paciente = required('./paciente.js');
var Embarazo = required('./embarazo.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var examen_schema = new Schema({
    fecha: { type: Date, required: true },
    observaciones: { type: String },
    embarazo: { type: Schema.Types.ObjectId, ref: 'Embarazo' },
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    grupoSanguineo: { tpye: Schema.Types.ObjectId, ref: 'GrupoSanguineo' },
    identificacionAnticuerpo: { type: Schema.Types.ObjectId, ref: 'IdentificacionAnticuerpo' },
    pesquizajeAnticuerpo: { type: Schema.Types.ObjectId, ref: 'PesquizajeAnticuerpo' },
    accessToken: { type: String }
});

//exportacion del modelo
var examen = mongoose.model('Examen', examen_schema);

module.exports.examen = examen;