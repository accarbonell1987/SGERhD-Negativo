//Importaciones
import React, { Component } from 'react';
import { Icon, Menu } from 'semantic-ui-react'

//CSS
import './global/css/Menu.css';

//Defincion de la clase
class ComponentMenu extends Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => {
    this.props.changeMenuOption(name);
  };

  render() {
    return (
      <Menu icon='labeled' inverted  className='menu-div' size='small'>
        <Menu.Item name='usuarios' active={this.props.opcionmenu === 'usuarios'} onClick={this.handleItemClick} >
          <Icon name='users' /> Usuarios
        </Menu.Item>
        <Menu.Item name='historiaclinica' active={this.props.opcionmenu === 'historiaclinica'} onClick={this.handleItemClick} >
          <Icon name='clipboard' /> Historia Clinica
        </Menu.Item>
        <Menu.Item name='paciente' active={this.props.opcionmenu === 'paciente'} onClick={this.handleItemClick} >
          <Icon name='wheelchair' /> Paciente
        </Menu.Item>
        <Menu.Item name='examen' active={this.props.opcionmenu === 'examen'} onClick={this.handleItemClick} >
          <Icon name='clipboard list' /> Exámen
        </Menu.Item>
        <Menu.Item name='transfusiones' active={this.props.opcionmenu === 'transfusiones'} onClick={this.handleItemClick} >
          <Icon name='tint' /> Transfusiones
        </Menu.Item>
        <Menu.Item name='embarazo' active={this.props.opcionmenu === 'embarazo'} onClick={this.handleItemClick} >
          <Icon name='heartbeat' /> Embarazo
        </Menu.Item>
      </Menu>
    );
  }
}

export default ComponentMenu;