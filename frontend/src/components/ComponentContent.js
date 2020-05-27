//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentUsers from './usuario/ComponentUsers';
import ComponentFooter from './ComponentFooter';

//Defincion de la clase
class ComponentContent extends Component {

  render() {
    // switch (this.props.opcionmenu) {
    //   case 'usuarios': {
    //     return (
    //       <ComponentUsuario />
    //     );
    //   };
    //   case 'pacientes': {
    //     return (
    //       <ComponentUsuario />
    //     );
    //   };
    //   default: {
    //     return (
    //       <div className="Content">
    //         <h1>Soy el contenido</h1>
    //         <p>Lorem impsum...</p>
    //       </div>
    //     );
    //   }
    // }
    if (this.props.opcionmenu === 'usuarios') {
      return (
        <div className='Content'>
          <ComponentUsers endpoint = { this.props.endpoint } parentState = {this.props.parentState}/>
          <ComponentFooter />
        </div>
      );
    } else {
      return (
        <div>
          <h2>OTRA {this.props.opcionmenu}</h2>
          <ComponentFooter />
        </div>
      );
    }
  }
}

export default ComponentContent;