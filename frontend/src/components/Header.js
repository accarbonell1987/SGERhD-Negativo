import React, { Component } from 'react';
import logo from './global/images/logo.svg';
import './global/css/Header.css';

class Header extends Component {
  render() {
    return (
      <div className="Header">
          <img src={logo} className="Logo" alt="logo" />
          <h1>Header de la aplicacion</h1>
      </div>
    );
  }
}

export default Header;