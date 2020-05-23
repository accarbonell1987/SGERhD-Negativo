//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentHeader from './ComponentHeader';
import ComponentContent from './ComponentContent';

import ComponentMenu from './ComponentMenu';

//Definicion de la clase
class ComponentDashboard extends Component {
  state = {
    opcionmenu: 'usuarios',
  };
  
  cambiarOpcionMenu = (opcion) => {
    this.setState({ opcionmenu: opcion});
    console.log('cambiarOpcionMenu -> '+opcion);
  }

  render() {
    if (this.props.autenticado) {
      console.log('render -> '+this.state.opcionmenu);
      return (
        <div className="Dashboard">
          <ComponentHeader modificarLoginState = {this.props.modificarLoginState} endpoint = {this.props.endpoint} />
          <ComponentMenu cambiarOpcionMenu = {this.cambiarOpcionMenu} opcionmenu = {this.state.opcionmenu} />
          <ComponentContent endpoint = { this.props.endpoint } />
        </div>
      );
    }
  }
}

export default ComponentDashboard;