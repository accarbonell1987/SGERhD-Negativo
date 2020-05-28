//Importaciones
import React, { Component } from 'react';
import { Button, Grid, Icon, Label, Table } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

//Componentes
import ComponentAddPatient from './ComponentAddPatient';
import ComponentUpdatePatient from './ComponentUpdatePatient';
import ComponentChilds from './ComponentChilds';

//Defincion de la clase
class ComponentPatients extends Component {
  state = {
    pacientes: []
  }

  constructor(props) {
    super(props);

    this.allPatients = this.allPatients.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
  }

  componentDidMount = () => {
    this.allPatients();
  }
  //eliminar el paciente
  deletePatient = (id, nombre, apellidos) => {
    //Esta seguro?
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Desea eliminar el paciente: " + nombre + " " + apellidos,
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
        fetch (this.props.parentState.endpoint + 'api/paciente/' + id, {
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
          status === 'OK' ?
            Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 })
          :
            Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })

          this.allPatients();
        })
        .catch(err => {
          Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
        });
      }
    })
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
        if (data.status === 'OK'){
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
    const accesomenu = permiso.accesos.find(p => p.opcion === 'pacientes');
    //chequear si es paciente y tengo permiso
    return (
      <Grid textAlign='center' verticalAlign='top' className='gestionar-allgrid'>
        <Grid.Column className='gestionar-allcolumn'>
          <Label attached='top left' className='div-label-attached' size='large'>
            <Icon name='wheelchair' size='large' inverted/> Gestión de Pacientes
          </Label>
          <Table compact celled definition attached='top' className='div-table'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='12'>
                  { accesomenu.permisos.crear ?
                    <ComponentAddPatient allPatients = {this.allPatients}  parentState = {this.props.parentState} roles = {this.props.roles} /> :
                    <Button floated='right' icon labelPosition='left' primary size='small' className='modal-button-add' disabled>
                      <Icon name='add circle' /> Adicionar
                    </Button>
                  }
                </Table.HeaderCell>
              </Table.Row>
              { 
                (this.state.pacientes.length > 0) ? 
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Nombres y Apellidos</Table.HeaderCell>
                  <Table.HeaderCell>Carnet Identidad</Table.HeaderCell>
                  <Table.HeaderCell>Dirección</Table.HeaderCell>
                  <Table.HeaderCell>Teléfonos</Table.HeaderCell>
                  <Table.HeaderCell>Madre</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Género</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Hijos</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Transfusiones</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Embarazos</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Examenes</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Acciones</Table.HeaderCell>
                </Table.Row> : ''
              }
            </Table.Header>

            <Table.Body>
              { this.state.pacientes.map(paciente => {
                  let madre = this.state.pacientes.find(p => p._id === paciente.madre);
                  let madrenombreyapellido = (madre == null) ? 'Indefinido' : madre.nombre + ' ' + madre.apellidos;
                  // let rolData = this.props.roles.find(element => { return element.key === usuario.rol });
                  // //para colorear row
                  // let negative = this.props.parentState.usuario === usuario.nombre;
                  return(
                    <Table.Row key={paciente._id} >
                      <Table.Cell collapsing>
                        <Icon name='wheelchair' />
                      </Table.Cell>
                      <Table.Cell>{paciente.nombre} {paciente.apellidos}</Table.Cell>
                      <Table.Cell>{paciente.ci}</Table.Cell>
                      <Table.Cell>{paciente.direccion}</Table.Cell>
                      <Table.Cell>{paciente.telefono}</Table.Cell>
                      <Table.Cell>
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='venus' className='button-icon-childs'/>{madrenombreyapellido}
                        </Button> 
                      </Table.Cell>
                      <Table.Cell>
                      {
                        paciente.sexo === 'M' ? 
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='man' className='button-icon-childs'/>Masculino
                        </Button>  
                        : 
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='woman' className='button-icon-childs'/>Femenino
                        </Button>
                      }
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <ComponentChilds parentState = {this.props.parentState} paciente = {paciente} pacientes = {this.state.pacientes} allPatients = {this.allPatients} />
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='tint' className='button-icon-childs'/>Transfusiones
                        </Button> 
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='heartbeat' className='button-icon-childs'/>Embarazos
                        </Button> 
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <Button icon labelPosition='right' className='button-childs'>
                          <Icon name='clipboard list' className='button-icon-childs'/>Exámenes
                        </Button> 
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        {
                          //acceso a eliminar
                          accesomenu.permisos.eliminar ?
                          <Button icon='remove circle' className = 'button-remove' onClick={() => this.deletePatient(paciente._id, paciente.nombre, paciente.apellidos) } /> : <Button icon='remove circle' className = 'button-remove' disabled />
                        }
                        {
                          accesomenu.permisos.modificar ?
                          <ComponentUpdatePatient allPatients = { this.allPatients } pacienteid = {paciente._id} parentState = {this.props.parentState} roles = {this.props.roles} /> :
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

export default ComponentPatients;