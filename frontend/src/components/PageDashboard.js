//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentHeader from './PageHeader';
import ComponentContent from './PageContent';
import ComponentFooter from './PageFooter';
import ComponentLogin from './PageLogin';

//Definicion de la clase
class PageDashboard extends Component {

  constructor(props){
    super(props);

    this.state = {
      autenticado: false,
      logintime: '',
      usuario: '',
      rol: ''
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
          <ComponentHeader modifyLoginState = {this.modifyLoginState}/>
          <ComponentContent />
          <ComponentFooter />
        </div>
      )
    }else{
      return (
        <ComponentLogin modifyLoginState = {this.modifyLoginState} />
      )
    }
  }
}

export default PageDashboard;