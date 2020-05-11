//librerias
var mongoose = required('mongoose');
var Schema = mongoose.Schema;

//conexion del mongo a la bd
mongoose.connect('mongodb://localhost/sgerhn');

//roles
var roles = ['usuario',  'recepcionista', 'informatico', 'especialista', 'doctor'];

//definiendo el esquema
var usuario_schema = new Schema({
    nombre: { type: String, required: true },
    contraseña: { type: String, required: true },
    rol: { type: String, default: 'usuario', required = true, enum: roles },accessToken: { type: String }
});

//virtuals
usuario_schema.virtual('confirmacion_contraseña').get(function(){
    return this.c_contraseña;
}).set(function(contraseña){
    this.c_contraseña = contraseña;
});


//exportacion del modelo
var usuario = mongoose.model('Usuario', usuario_schema);

module.exports.usuario = usuario;