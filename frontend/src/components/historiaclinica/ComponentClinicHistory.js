//Importaciones
import React, { Component } from 'react';
import { Button, Grid, Icon, Label, Table } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

//Componentes
import ComponentAddClinicHistory from './ComponentAddClinicHistory';
import ComponentUpdateClinicHistory from './ComponentUpdateClinicHistory';

//Defincion de la clase
class ComponentClinicHistory extends Component {
  state = {
    historiasclinica: [],
    pacientes: []
  }

  constructor(props) {
    super(props);

    this.allClinicsHistory = this.allClinicsHistory.bind(this);
    this.allPatients = this.allPatients.bind(this);
    this.deleteClinicHistory = this.deleteClinicHistory.bind(this);
  }

  componentDidMount = () => {
    this.allClinicsHistory();
    this.allPatients();
  }
  //obtener propiedades de historia clinica
  getClinicHistory = (id) => {
    //enviar al endpoint
    fetch (this.props.parentState.endpoint + 'api/historiaclinica/' + id, {
      method: 'GET',
      headers: {
        'access-token' : this.props.parentState.token
      }
    })
    .then(res => res.json())
    .then(jsondata => {
      const { status, message, data } = jsondata;
      if (status === 200) {
        return data;
      }else{
        Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })
      }
    })
    .catch(err => {
      Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
    });
  }
  //eliminar el historia clinica
  deleteClinicHistory = (id, paciente) => {
    //Esta seguro?
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Desea eliminar la historia clinica perteneciente al paciente: " + paciente.nombre + " " + paciente.apellidos,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#db2828',
      confirmButtonColor: '#21ba45',
      confirmButtonText: 'Si, Eliminar',
      reverseButtons: true
    })
    .then((result) => {
      //si escogio Si
      if (result.value) {
        //enviar al endpoint
        fetch (this.props.parentState.endpoint + 'api/historiaclinica/' + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'access-token': this.props.parentState.token
          }
        })
        .then(res => res.json())
        .then(data => {
          const { status, message } = data;
          status === 200 ?
            Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 })
          :
            Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })

          this.allClinicsHistory();
        })
        .catch(err => {
          Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
        });
      }
    })
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
          this.setState({historiasclinica: data.data});
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

  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find(p => p.opcion === 'historiaclinica');
    //chequear si es historiasclinica y tengo permiso
    return (
      <Grid textAlign='center' verticalAlign='top' className='gestionar-allgrid'>
        <Grid.Column className='gestionar-allcolumn'>
          <Label attached='top left' className='div-label-attached' size='large'>
            <Icon name='clipboard' size='large' inverted/> Gestión de Historias Clínicas
          </Label>
          <Table compact celled definition attached='top' className='div-table'>
            <Table.Header className='div-table-header'>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='9'>
                  { accesomenu.permisos.crear ?
                    <ComponentAddClinicHistory allClinicsHistory = {this.allClinicsHistory}  parentState = {this.props.parentState} roles = {this.props.roles} pacientes = {this.state.pacientes} /> :
                    <Button floated='right' icon labelPosition='left' primary size='small' className='modal-button-add' disabled>
                      <Icon name='add circle' /> Adicionar
                    </Button>
                  }
                </Table.HeaderCell>
              </Table.Row>
              { 
                
                (this.state.historiasclinica.length > 0) ? 
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Número</Table.HeaderCell>
                  <Table.HeaderCell>Area de Salud</Table.HeaderCell>
                  <Table.HeaderCell>Vacuna AntiD</Table.HeaderCell>
                  <Table.HeaderCell>Partos</Table.HeaderCell>
                  <Table.HeaderCell>Abortos</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Embarazos</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Paciente</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Acciones</Table.HeaderCell>
                </Table.Row> : ''
              }
            </Table.Header>

            <Table.Body>
              { 
                this.state.historiasclinica.map(historia => {
                  // let rolData = this.props.roles.find(element => { return element.key === usuario.rol });
                  // //para colorear row
                  // let negative = this.props.parentState.usuario === usuario.nombre;
                  return(
                    <Table.Row key={historia._id} >
                      <Table.Cell collapsing>
                        <Icon name='clipboard' />
                      </Table.Cell>
                      <Table.Cell>{historia.numerohistoria}</Table.Cell>
                      <Table.Cell>{historia.areaDeSalud}</Table.Cell>
                      <Table.Cell>{historia.numerohistoria}</Table.Cell>
                      <Table.Cell>{historia.vacunaAntiD}</Table.Cell>
                      <Table.Cell>{historia.numeroDePartos}</Table.Cell>
                      <Table.Cell>{historia.numeroDeAbortos}</Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='heartbeat' className='button-icon-childs'/>0
                        </Button> 
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='clipboard' className='button-icon-childs'/>Vacia
                        </Button> 
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        {
                          accesomenu.permisos.eliminar ?
                          <Button icon='remove circle' className = 'button-remove' onClick={() => this.deleteClinicHistory(historia._id, historia.paciente) } /> : <Button icon='remove circle' className = 'button-remove' disabled />
                        }
                        {
                          accesomenu.permisos.modificar ?
                          <ComponentUpdateClinicHistory allClinicsHistory = { this.allClinicsHistory } historiaid = {historia._id} parentState = {this.props.parentState} roles = {this.props.roles} /> :
                          <Button icon='edit' disabled />
                        }
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ComponentClinicHistory;