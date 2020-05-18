//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Defincion de la clase
class PageContent extends Component {
  render() {
    return (
      <div className="Content">
          <h1>Soy el contenido</h1>
          <p>Lorem impsum...</p>
      </div>
    );
  }
}

export default PageContent;