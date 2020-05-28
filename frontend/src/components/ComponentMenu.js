//Importaciones
import React, { Component } from 'react';
import { Icon, Menu } from 'semantic-ui-react'

//CSS
import './global/css/Menu.css';

//Defincion de la clase
class ComponentMenu extends Component {
  state = {
    visibleusuario: false,
    visiblehistoriaclinica: false,
    visiblepaciente: false,
    visibleexamen: false,
    visibletransfusiones: false,
    visibleembarazo: false
  }

  menus = [
    {name: 'usuarios', icon: 'users', visible: false, label: 'Usuarios'},
    {name: 'historiaclinica', icon: 'clipboard', visible: false, label: 'Historia Clínica' },
    {name: 'pacientes', icon: 'wheelchair', visible: false, label: 'Pacientes' },
    {name: 'examenes', icon: 'clipboard list', visible: false, label: 'Exámenes' },
    {name: 'transfusiones', icon: 'tint', visible: false, label: 'Transfusiones' },
    {name: 'embarazos', icon: 'heartbeat', visible: false, label: 'Embarazos' }
  ];

  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => {
    this.props.changeMenuOption(name);
  };

  render() {
    return (
      <Menu inverted className='menu-div' size='small' icon='labeled'>
        { 
          this.menus.map(menu => {
            //buscar el permiso del rol
            const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
            //buscar el acceso del menu
            const accesomenu = permiso.accesos.find(p => p.opcion === menu.name);
            //chequear su (menu) es true
            if (accesomenu.permisos.menu) {
              return (
                <Menu.Item key={menu.name} name={menu.name} active={this.props.opcionmenu === menu.name} onClick={this.handleItemClick} >
                  <Icon name={menu.icon} /> {menu.label}
                </Menu.Item>
              )
            } else return '';
          })
        }
      </Menu>
    );
  }
}

export default ComponentMenu;