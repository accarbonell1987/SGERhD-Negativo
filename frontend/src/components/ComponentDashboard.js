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

  constructor(props) {
    super(props);
    this.changeMenuOption = this.changeMenuOption.bind(this);
  }
  
  changeMenuOption = (opcion) => {
    this.setState({ opcionmenu: opcion});
  }

  render() {
    if (this.props.parentState.autenticado) {
      return (
        <div className="Dashboard">
          <ComponentHeader changeLoginState = {this.props.changeLoginState} parentState = {this.props.parentState} />
          <ComponentMenu changeMenuOption = {this.changeMenuOption} opcionmenu = {this.state.opcionmenu} parentState = {this.props.parentState} />
          <ComponentContent opcionmenu = {this.state.opcionmenu} parentState = {this.props.parentState} />
        </div>
      );
    }
  }
}

export default ComponentDashboard;