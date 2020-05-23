//Requeridos
var mongoose = require('mongoose');

require('dotenv').config();

var Schema = mongoose.Schema;

//Conexion del mongo a la bd
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Conectado a la BD: '+process.env.DB_CONNECT))
    .catch(err => console.error('Error: '+err));

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
        accessToken: { type: String }
    });

    //EMBARAZO
    var embarazo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        tiempoDeGestacion: { type: Number, required: true },
        observaciones: { type: String },
        examenes: [{ type: Schema.Types.ObjectId, ref: 'Examen' }],
        paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
        accessToken: { type: String }
    });

    //EXAMEN
    var examen_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        observaciones: { type: String },
        embarazo: { type: Schema.Types.ObjectId, ref: 'Embarazo' },
        paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
        grupoSanguineo: { type: Schema.Types.ObjectId, ref: 'GrupoSanguineo' },
        identificacionAnticuerpo: { type: Schema.Types.ObjectId, ref: 'IdentificacionAnticuerpo' },
        pesquizajeAnticuerpo: { type: Schema.Types.ObjectId, ref: 'PesquizajeAnticuerpo' },
        accessToken: { type: String }
    });

    //HISTORIACLINICA
    var historiaclinica_schema = new Schema({
        fechaDeCreacion: { type: Date, require: true, default: Date.now },
        numero: { type: Number, require: true },
        vacunaAntiD: { type: Boolean },
        numeroDeEmbarazos: { type: Number, min: 0 },
        numeroDePartos: { type: Number, min: 0 },
        numeroDeAbortos: { type: Number, min: 0 },
        paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
        accessToken: { type: String }
    });

    //PACIENTE
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

    //TRANSFUSION
    var transfusion_schema = new Schema({
        fecha: {type: Date, required: true, default: Date.now },
        observaciones: { type: String },
        reacionAdversa: { type: Boolean },
        paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
        accessToken: { type: String }
    });

    //USUARIO
    var usuario_schema = new Schema({
        nombre: { type: String, required: 'nombre de usuario vacio' },
        email: { type: String, required: 'correo electrónico no valido', match:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/ },
        contraseña: { type: String, required: true, minlength:[8, 'contraseña muy corta'] },
        rol: { type: String, default: 'usuario', required: 'debe escoger un rol', enum: roles }, 
        accessToken: { type: String }
    });
    //virtuals
    usuario_schema.virtual('confirmacion_contraseña').get(function(){
        return this.c_contraseña;
    }).set(function(contraseña){
        this.c_contraseña = contraseña;
    });

    //GRUPO SANGUINEO
    var gruposanguineo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        dDebil : { type: String },
        gSanguineo : { type: String },
        factor : { type: String },
        examen: { type: Schema.Types.ObjectId, ref: 'Examen' },
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
        examen: { type: Schema.Types.ObjectId, ref: 'Examen' },
        accessToken: { type: String }
    });

    //PESQUIZAJEANTICUERPO
    var pesquizajeanticuerpo_schema = new Schema({
        fecha: { type: Date, required: true, default: Date.now },
        tipoCelula: { type: String },
        pCoomsIndirecto: { type: String },
        pSalina4g: { type: String },
        pSalina37g: { type: String },
        examen: { type: Schema.Types.ObjectId, ref: 'Examen' },
        accessToken: { type: String }
    });

//exportacion del modelo
var pesquizajeanticuerpo = mongoose.model('PesquizajeAnticuerpo', pesquizajeanticuerpo_schema);
var identificacionanticuerpo = mongoose.model('IdentificacionAnticuerpo', identificacionanticuerpo_schema);
var gruposanguineo = mongoose.model('GrupoSanguineo', gruposanguineo_schema);
var usuario = mongoose.model('Usuario', usuario_schema);
var transfusion = mongoose.model('Transfusion', transfusion_schema);
var paciente = mongoose.model('Paciente', paciente_schema);
var historiaclinica = mongoose.model('HistoriaClinica', historiaclinica_schema);
var examen = mongoose.model('Examen', examen_schema);
var embarazo = mongoose.model('Embarazo', embarazo_schema);
var logacceso = mongoose.model('LogAcceso', logacceso_schema);

//exportacion del modelos
module.exports = {
    'embarazo': embarazo,
    'logaceso': logacceso,
    'examen' : examen,
    'historiaclinica' : historiaclinica,
    'paciente' : paciente,
    'transfusion' : transfusion,
    'usuario' : usuario,
    'pesquizajeanticuerpo' : pesquizajeanticuerpo,
    'identificacionanticuerpo' : identificacionanticuerpo,
    'gruposanguineo' : gruposanguineo
}