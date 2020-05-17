import React, { Component } from 'react';
import './global/css/Header.css';

class Header extends Component {
  render() {
    return (
      <div className="Header">
          <img src={require('./global/images/logo.svg')} className="Logo" alt="logo" />
          <h5>Header de la aplicacion</h5>
      </div>
    );
  }
}

export default Header;