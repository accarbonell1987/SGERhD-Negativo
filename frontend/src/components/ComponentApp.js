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
    autenticado: true,
    logintime: '',
    usuario: '',
    rol: '',
    endpoint: process.env.REACT_APP_API_PATH_LOCAL
  };
  
  //modificar el valor del login
  modificarLoginState = () => {
    this.setState({ autenticado: !this.state.autenticado });
    this.setState({ logintime: this.state.autenticado ? Date.now : '' });
  }

  render() {
    if (this.state.autenticado) {
      return (
        <ComponentDashboard modificarLoginState = {this.modificarLoginState} endpoint = {this.state.endpoint} autenticado = {this.state.autenticado} />
      )
    }else{
      return (
        <ComponentLogin modificarLoginState = {this.modificarLoginState} endpoint = {this.state.endpoint} />
      )
    }
  }
}

export default ComponentApp;