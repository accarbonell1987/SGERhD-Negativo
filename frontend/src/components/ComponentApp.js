//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentLogin from './ComponentLogin';
import ComponentDashboard from './ComponentDashboard';

//Definicion de la clase
class ComponentApp extends Component {
  state = {
    autenticado: false,
    usuario: '',
    rol: '',
    endpoint: process.env.REACT_APP_API_PATH,
    logintime: '',
    token: '',
  };

  permisos = [
    { rol: 'usuario',
      accesos: [ 
        { opcion: 'usuarios', permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: 'historiaclinica', permisos: { crear: false, leer:false, modificar: false, eliminar: false, menu: false } },
        { opcion: 'pacientes', permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: 'examenes', permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: 'transfusiones', permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: 'embarazos', permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } } 
      ]
    },
    { rol: 'recepcionista', 
      accesos: [
        { opcion: 'usuarios', permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: false } },
        { opcion: 'historiaclinica', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'pacientes', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'examenes', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'transfusiones', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'embarazos', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } }
      ]
    },
    { rol: 'informatico', 
      accesos: [
        { opcion: 'usuarios', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'historiaclinica', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'pacientes', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'examenes', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'transfusiones', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'embarazos', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } }
      ]
    },
    { rol: 'especialista', 
      accesos: [
        { opcion: 'usuarios', permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: false } },
        { opcion: 'historiaclinica', permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: 'pacientes', permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: 'examenes', permisos: { crear: false, leer: true, modificar: true, eliminar: false, menu: true } },
        { opcion: 'transfusiones', permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: 'embarazos', permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } }
      ]
    },
    { rol: 'doctor', 
      accesos: [ 
        { opcion: 'usuarios', permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: false } },
        { opcion: 'historiaclinica', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'pacientes', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'examenes', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'transfusiones', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: 'embarazos', permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } }
      ] 
    }
  ];

  roles = [
    { key: 'usuario', text: 'Usuario', value: 'usuario', image: { avatar: true, src: require('./global/images/jenny.jpg') } },
    { key: 'recepcionista', text: 'Recepcionista', value: 'recepcionista', image: { avatar: true, src: require('./global/images/molly.png') }},
    { key: 'informatico', text: 'Informático', value: 'informatico' , image: { avatar: true, src: require('./global/images/steve.jpg') }},
    { key: 'especialista', text: 'Especialista', value: 'especialista' , image: { avatar: true, src: require('./global/images/stevie.jpg') }},
    { key: 'doctor', text: 'Doctor', value: 'doctor', image: { avatar: true, src: require('./global/images/elliot.jpg') }}
  ];

  constructor(props) {
    super(props);

    this.changeLoginState = this.changeLoginState.bind(this);
  }
  
  //modificar el valor del login
  changeLoginState = (usuario, rol, token) => {
    this.setState({ 
      autenticado: !this.state.autenticado,
      usuario: usuario,
      rol: rol,
      logintime: this.state.autenticado ? Date.now : '',
      token: token
     });
  }

  render() {
    if (this.state.autenticado) {
      return (
        <ComponentDashboard changeLoginState = {this.changeLoginState} parentState = {this.state} roles = {this.roles} permisos = {this.permisos} />
      )
    }else{
      return (
        <ComponentLogin changeLoginState = {this.changeLoginState} parentState = {this.state} />
      )
    }
  }
}

export default ComponentApp;