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
      isLoggedIn: false,
      username: '',
      role: ''
    };
  }

  //modificar el valor del login
  modifyLoginState = () => {
    this.setState({
      isLoggedIn: !this.state.isLoggedIn
    });
  }

  render() {
    if (this.state.isLoggedIn) {
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