//Importaciones
import React, { Component } from 'react';

//CSS
import './global/css/Content.css';

//Componentes
import ComponentUsers from './usuario/ComponentUsers';
import ComponentPatients from './paciente/ComponentPatients';
import ComponentClinicHistory from './historiaclinica/ComponentClinicHistory';
import ComponentFooter from './ComponentFooter';

//Defincion de la clase
class ComponentContent extends Component {

  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find(p => p.opcion === this.props.opcionmenu);
    //chequear si es usuario y tengo permiso
    if (this.props.opcionmenu === 'usuarios' && accesomenu.permisos.menu)  {
      return (
        <div className='Content'>
          <ComponentUsers parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} />
          <ComponentFooter />
        </div>
      );
    //chequear si es pacientes y tengo permiso
    } else if (this.props.opcionmenu === 'pacientes' && accesomenu.permisos.menu) {
      return (
        <div className='Content'>
          <ComponentPatients parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} />
          <ComponentFooter />
        </div>
      );
    //chequear si es pacientes y tengo permiso
    } else if (this.props.opcionmenu === 'historiaclinica' && accesomenu.permisos.menu) {
      return (
        <div className='Content'>
          <ComponentClinicHistory parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} />
          <ComponentFooter />
        </div>
      );
    } else {
      return (
        <div>
          <h2>OTRA {this.props.opcionmenu}</h2>
          <ComponentFooter />
        </div>
      );
    }
  }
}

export default ComponentContent;