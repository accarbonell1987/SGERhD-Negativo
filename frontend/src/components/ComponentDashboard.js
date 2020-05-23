//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentHeader from './ComponentHeader';
import ComponentContent from './ComponentContent';
import ComponentFooter from './ComponentFooter';
import ComponentLogin from './ComponentLogin';
import ComponentMenu from './ComponentMenu';

//Definicion de la clase
class ComponentDashboard extends Component {

  constructor(props){
    super(props);

    this.state = {
      autenticado: true,
      logintime: '',
      usuario: '',
      rol: '',
      endpoint: process.env.REACT_APP_API_PATH_LOCAL
    };
  }

  //modificar el valor del login
  modifyLoginState = (evt) => {
    this.setState({ autenticado: !this.state.autenticado });
    this.setState({ logintime: this.state.autenticado ? Date.now : '' });
    
    console.log(this.state.logintime);
  }

  render() {
    if (this.state.autenticado) {
      return (
        <div className="Dashboard">
          <ComponentHeader modifyLoginState = {this.modifyLoginState} endpoint = {this.state.endpoint} />
          <ComponentMenu endpoint = {this.state.endpoint} />
          <ComponentContent />
          <ComponentFooter />
        </div>
      )
    }else{
      return (
        <ComponentLogin modifyLoginState = {this.modifyLoginState} endpoint = {this.state.endpoint} />
      )
    }
  }
}

export default ComponentDashboard;