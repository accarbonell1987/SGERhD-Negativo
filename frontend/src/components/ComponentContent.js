//Importaciones
import React, { Component } from 'react';
import Swal from 'sweetalert2'

//CSS
import './global/css/Content.css';

//Componentes
import ComponentUsers from './usuario/ComponentUsers';
import ComponentPatients from './paciente/ComponentPatients';
import ComponentClinicHistory from './historiaclinica/ComponentClinicHistory';
import ComponentTrans from './transfusiones/ComponentTrans';
import ComponentFooter from './ComponentFooter';

//Defincion de la clase
class ComponentContent extends Component {
  state = {
    pacientes: [],
    usuarios: [],
    historiasclinicas: [],
    transfusiones: []
  }

  constructor(props) {
    super(props);

    this.allUsers = this.allUsers.bind(this);
    this.allTrans = this.allTrans.bind(this);
    this.allClinicsHistory = this.allClinicsHistory.bind(this);
    this.allPatients = this.allPatients.bind(this);
  }

  componentDidMount = () => {
    this.allTrans();
    this.allClinicsHistory();
    this.allPatients();
    this.allUsers();
  }

  //obtener todos los historia clinica desde la API
  allClinicsHistory = async () => {
    await fetch(this.props.parentState.endpoint + 'api/historiaclinica', {
        method: 'GET',
        headers: {
          'access-token' : this.props.parentState.token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200){
          this.setState({historiasclinicas: data.data});
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: data.message, showConfirmButton: false, timer: 3000 }); 
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 });
      });
  }
  //obtener todos los pacientes desde la API
  allPatients = async () => {
    await fetch(this.props.parentState.endpoint + 'api/paciente', {
        method: 'GET',
        headers: {
          'access-token' : this.props.parentState.token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200){
          this.setState({pacientes: data.data});
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: data.message, showConfirmButton: false, timer: 3000 }); 
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 });
      });
  }
  allTrans = async () => {
    await fetch(this.props.parentState.endpoint + 'api/transfusion', {
        method: 'GET',
        headers: {
          'access-token' : this.props.parentState.token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200){
          this.setState({pacientes: data.data});
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: data.message, showConfirmButton: false, timer: 3000 }); 
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 });
      });
  }
  //obtener todos los usuarios desde la API
  allUsers = async () => {
    await fetch(this.props.parentState.endpoint + 'api/usuario', {
        method: 'GET',
        headers: {
          'access-token' : this.props.parentState.token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200){
          this.setState({usuarios: data.data});
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: data.message, showConfirmButton: false, timer: 3000 }); 
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 });
      });
  }

  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find(p => p.opcion === this.props.opcionmenu);
    //chequear si es usuario y tengo permiso
    if (this.props.opcionmenu === 'usuarios' && accesomenu.permisos.menu)  {
      return (
        <div className='Content'>
          <ComponentUsers parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} usuarios = {this.state.usuarios} allUsers={this.allUsers}/>
          <ComponentFooter />
        </div>
      );
    //chequear si es pacientes y tengo permiso
    } else if (this.props.opcionmenu === 'pacientes' && accesomenu.permisos.menu) {
      return (
        <div className='Content'>
          <ComponentPatients parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} pacientes = {this.state.pacientes}  historiasclinicas = {this.state.historiasclinicas} allClinicsHistory = {this.allClinicsHistory} allPatients = {this.allPatients} />
          <ComponentFooter />
        </div>
      );
    //chequear si es pacientes y tengo permiso
    } else if (this.props.opcionmenu === 'historiaclinica' && accesomenu.permisos.menu) {
      return (
        <div className='Content'>
          <ComponentClinicHistory parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} pacientes = {this.state.pacientes} historiasclinicas = {this.state.historiasclinicas} allClinicsHistory = {this.allClinicsHistory} allPatients = {this.allPatients}/>
          <ComponentFooter />
        </div>
      );
    }  else if (this.props.opcionmenu === 'transfusiones' && accesomenu.permisos.menu) {
      return (
        <div className='Content'>
          <ComponentTrans parentState = {this.props.parentState} roles = {this.props.roles} permisos = {this.props.permisos} pacientes = {this.state.pacientes} transfusiones={this.state.transfusiones} allTrans = {this.allTrans} allPatients = {this.allPatients}/>
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