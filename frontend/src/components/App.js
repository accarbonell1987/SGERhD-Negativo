import React, { Component } from 'react';
import './global/css/App.css';

//Componentes
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

export default App;