//Importaciones
import React, { Component } from 'react';
import './components/global/css/App.css';

import Dashboard from './components/Dashboard';

//Definicion de la clase
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="section section-signup page-header">
          <div className="container container-no-padding">
            <div className="row">
              <div className="col col-sm-12">
                <Dashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;