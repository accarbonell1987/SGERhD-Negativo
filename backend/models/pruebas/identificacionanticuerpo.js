//requerido
var mongoose = required('mongoose');

var Examen = required('../examen.js');

var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//definiendo el esquema
var identificacionanticuerpo_schema = new Schema({
    fecha: { type: Date, required: true },
    pTipoIdentificacionEnCoombsIndirecto : { type: String },
    pTipoDeAnticuerpoEnsalina4g : { type: String },
    pTipoDeAnticuerpoEnSalina37g : { type: String },
    tituloDelAnticuerpoParaCoombsIndirecto : { type: String },
    tituloDelAnticuerpoParaSalina4g : { type: String },
    tituloDelAnticuerpoParaSalina37g : { type: String },
    examen: { type: Schema.Types.ObjectId, ref: 'Examen' },
    accessToken: { type: String }
});

//exportacion del modelo
var identificacionanticuerpo = mongoose.model('IdentificacionAnticuerpo', identificacionanticuerpo_schema);

module.exports.identificacionanticuerpo = identificacionanticuerpo;