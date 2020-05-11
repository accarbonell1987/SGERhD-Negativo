//librerias
var mongoose = required('mongoose');
var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var logacceso_schema = new Schema({
    fecha: { type: Date, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    accessToken: { type: String }
});

//exportacion del modelo
var logacceso = mongoose.model('LogAcceso', logacceso_schema);

module.exports.logacceso = logacceso;