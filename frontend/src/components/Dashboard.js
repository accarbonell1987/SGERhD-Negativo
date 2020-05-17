import React, { Component } from 'react';
import './global/css/Content.css';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import Login from './Login';

class Dashboard extends Component {

  state = {
    isLoggedIn: false,
    username: '',
    role: ''
  };

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className="Dashboard">
          <Header />
          <Content />
          <Footer />
        </div>
      )
    }else{
      return (
        <Login 
          // username = 'Alberto Carlos'
        />
      )
    }
  }
}

export default Dashboard;