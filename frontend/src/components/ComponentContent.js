//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentUsuario from './usuario/ComponentUsuario';
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
    return (
      <div className='Content'>
        <ComponentUsuario endpoint = { this.props.endpoint } />
        <ComponentFooter />
      </div>
    );
  }
}

export default ComponentContent;