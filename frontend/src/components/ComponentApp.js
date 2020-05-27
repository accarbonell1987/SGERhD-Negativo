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
    endpoint: process.env.REACT_APP_API_PATH_LOCAL,
    logintime: '',
    token: '',
  };

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
        <ComponentDashboard changeLoginState = {this.changeLoginState} parentState = {this.state} />
      )
    }else{
      return (
        <ComponentLogin changeLoginState = {this.changeLoginState} parentState = {this.state} />
      )
    }
  }
}

export default ComponentApp;