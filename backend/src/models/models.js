//Requeridos
var mongoose = require('mongoose');

require('dotenv').config();

var Schema = mongoose.Schema;

//Conexion del mongo a la bd
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Conectado a la BD: '+process.env.DB_CONNECT))
    .catch(err => console.error('Error: '+err));

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error en conexion:'));

//ESQUEMAS...
    //ENUM ROLES
    var roles = ['usuario',  'recepcionista', 'informatico', 'especialista', 'doctor'];

    //LOGACCESO
    var logacceso_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //EMBARAZO
    var embarazo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        tiempoDeGestacion: { type: Number, required: true },
        observaciones: { type: String },
        examenes: [],
        tipos: { type: String, default: 'nuevo', require: 'Debe de escoger el tipo de embarazo'},
        findeembarazo: { type: String, default: 'parto', require: 'Debe de escoger el fin de embarazo'},
        findeaborto: { type: String, default: 'interrumpido'},
        findeparto: { type: String, default: 'natural'},
        paciente: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //EXAMEN
    var examen_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        observaciones: { type: String },
        embarazo: { type: String },
        paciente: { type: String },
        grupoSanguineo: { type: String },
        identificacionAnticuerpo: { type: String },
        pesquizajeAnticuerpo: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //HISTORIACLINICA
    var historiaclinica_schema = new Schema({
        fechaDeCreacion: { type: Date, require: true, default: Date.now },
        areaDeSalud: { type: String },
        numerohistoria: { type: Number, require: true },
        vacunaAntiD: { type: Boolean },
        numeroDeEmbarazos: { type: Number, min: 0 },
        numeroDePartos: { type: Number, min: 0 },
        numeroDeAbortos: { type: Number, min: 0 },
        paciente: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //PACIENTE
    var paciente_schema = new Schema({
        fechaDeCreacion: { type: Date, require: 'fecha de creacion requerida' , default: Date.now },
        nombre: { type: String, required: 'nombre obligatorio' },
        apellidos: { type: String, required: 'apellidos obligatorios' },
        ci: { type: String, required: 'carnet de identidad obligatorio', minlength:[11,'el carnet de identidad debe de tener 11 digitos'], maxlength:[11,'el ci debe de tener 11 digitos'] },
        direccion: { type: String, required: 'debe de existir una dirección' },
        direccionopcional: { type: String },
        telefono: { type: Number },
        sexo: { type: String, default: 'F', required: 'debe de existir un sexo definido'},
        madre: { type: String },
        padre: { type: String},
        hijos: [],
        transfusiones: [],
        embarazos: [],
        examenes: [],
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //TRANSFUSION
    var transfusion_schema = new Schema({
        fecha: {type: Date, required: true, default: Date.now },
        observaciones: { type: String },
        reacionAdversa: { type: Boolean },
        paciente: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //USUARIO
    var usuario_schema = new Schema({
        nombre: { type: String, required: 'nombre de usuario vacio' },
        email: { type: String, required: 'correo electrónico no valido', match:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/ },
        contraseña: { type: String, required: true, minlength:[8, 'contraseña muy corta'] },
        rol: { type: String, default: 'usuario', required: 'debe escoger un rol', enum: roles }, 
        logs: [{ type: Schema.Types.ObjectId, ref: 'LogAcceso'}],
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //GRUPO SANGUINEO
    var gruposanguineo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        dDebil : { type: String },
        gSanguineo : { type: String },
        factor : { type: String },
        examen: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //IDENTIFICACIONANTICUERPO
    var identificacionanticuerpo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        pTipoIdentificacionEnCoombsIndirecto : { type: String },
        pTipoDeAnticuerpoEnsalina4g : { type: String },
        pTipoDeAnticuerpoEnSalina37g : { type: String },
        tituloDelAnticuerpoParaCoombsIndirecto : { type: String },
        tituloDelAnticuerpoParaSalina4g : { type: String },
        tituloDelAnticuerpoParaSalina37g : { type: String },
        examen: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

    //PESQUIZAJEANTICUERPO
    var pesquizajeanticuerpo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        tipoCelula: { type: String },
        pCoomsIndirecto: { type: String },
        pSalina4g: { type: String },
        pSalina37g: { type: String },
        examen: { type: String },
        activo: { type: Boolean },
        accessToken: { type: String }
    });

//exportacion del modelo
var PesquizajeAnticuerpo = mongoose.model('PesquizajeAnticuerpo', pesquizajeanticuerpo_schema);
var IdentificacionAnticuerpo = mongoose.model('IdentificacionAnticuerpo', identificacionanticuerpo_schema);
var GrupoSanguineo = mongoose.model('GrupoSanguineo', gruposanguineo_schema);
var Usuario = mongoose.model('Usuario', usuario_schema);
var Transfusion = mongoose.model('Transfusion', transfusion_schema);
var Paciente = mongoose.model('Paciente', paciente_schema);
var HistoriaClinica = mongoose.model('HistoriaClinica', historiaclinica_schema);
var Examen = mongoose.model('Examen', examen_schema);
var Embarazo = mongoose.model('Embarazo', embarazo_schema);
var LogAcceso = mongoose.model('LogAcceso', logacceso_schema);

//exportacion del modelos
module.exports = {
    'Embarazo': Embarazo,
    'LogAcceso': LogAcceso,
    'Examen' : Examen,
    'HistoriaClinica' : HistoriaClinica,
    'Paciente' : Paciente,
    'Transfusion' : Transfusion,
    'Usuario' : Usuario,
    'PesquizajeAnticuerpo' : PesquizajeAnticuerpo,
    'IdentificacionAnticuerpo' : IdentificacionAnticuerpo,
    'GrupoSanguineo' : GrupoSanguineo,
    'CollectionUserExist': this.CollectionUserExist
}