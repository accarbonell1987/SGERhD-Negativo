//requerido
var mongoose = required('mongoose');

var Examen = required('../examen.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var pesquizajeanticuerpo_schema = new Schema({
    fecha: { type: Date, required: true },
    tipoCelula: { type: String },
    pCoomsIndirecto: { type: String },
    pSalina4g: { type: String },
    pSalina37g: { type: String },
    examen: { type: Schema.Types.ObjectId, ref: 'Examen' },
    accessToken: { type: String }
});

//exportacion del modelo
var pesquizajeanticuerpo = mongoose.model('PesquizajeAnticuerpo', pesquizajeanticuerpo_schema);

module.exports.pesquizajeanticuerpo = pesquizajeanticuerpo;