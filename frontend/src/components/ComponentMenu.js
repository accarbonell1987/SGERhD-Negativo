//Importaciones
import React, { Component } from 'react';
import { Icon, Menu } from 'semantic-ui-react'

//CSS
import './global/css/Menu.css';

//Defincion de la clase
class ComponentMenu extends Component {
  state = { activeItem: 'gamepad' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  constructor (props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu icon='labeled' inverted  className='menu-div' size='small'>
        <Menu.Item name='usuarios' active={activeItem === 'usuarios'} onClick={this.handleItemClick} >
          <Icon name='users' /> Usuarios
        </Menu.Item>
        <Menu.Item name='historiaclinica' active={activeItem === 'historiaclinica'} onClick={this.handleItemClick} >
          <Icon name='clipboard' /> Historia Clinica
        </Menu.Item>
        <Menu.Item name='paciente' active={activeItem === 'paciente'} onClick={this.handleItemClick} >
          <Icon name='wheelchair' /> Paciente
        </Menu.Item>
        <Menu.Item name='examen' active={activeItem === 'examen'} onClick={this.handleItemClick} >
          <Icon name='clipboard list' /> Exámen
        </Menu.Item>
        <Menu.Item name='transfusiones' active={activeItem === 'transfusiones'} onClick={this.handleItemClick} >
          <Icon name='tint' /> Transfusiones
        </Menu.Item>
        <Menu.Item name='embarazo' active={activeItem === 'embarazo'} onClick={this.handleItemClick} >
          <Icon name='heartbeat' /> Embarazo
        </Menu.Item>
      </Menu>
    );
  }
}

export default ComponentMenu;