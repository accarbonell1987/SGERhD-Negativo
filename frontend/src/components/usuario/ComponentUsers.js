//Importaciones
import React, { Component } from 'react';
import { Button, Grid, Icon, Label, Table, Popup } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Usuario.css';

//Componentes
import ComponentAddUsers from './ComponentAddUser';

//Defincion de la clase
class ComponentUsers extends Component {
  state = {
    usuarios: []
  }

  constructor(props) {
    super(props);

    this.allUsers = this.allUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount = () => {
    this.allUsers();
  }

  //eliminar el usuario
  deleteUser = (id, nombre) => {
    //Esta seguro?
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Desea eliminar el usuario: " + nombre,
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      cancelButtonColor: 'red',
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    })
    .then((result) => {
      //si escogio Si
      if (result.value) {
        //enviar al endpoint
        fetch (this.props.endpoint + 'api/usuario/' + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(data => {
          const { status, message } = data;
          status === 'OK' ?
            Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 })
          :
              Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })
          //Actualizar el listado
          this.allUsers();
        })
        .catch(err => {
          Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
        });
      }
    })
  }

  updateUser = (id, nombre) => {
    console.log(id + ' -> '+nombre);
  }
  //obtener todos los usuarios desde la API
  allUsers = () => {
    fetch(this.props.endpoint + 'api/usuario')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status === 'OK'){
          this.setState({usuarios: data.data});
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: data.message, showConfirmButton: false, timer: 3000 }); 
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 }); //mostrar mensaje de error
      });
  }

  render() {
    return (
      <Grid textAlign='center' verticalAlign='top' className='allgrid'>
        <Grid.Column className='allcolumn'>
          <Label attached='top right' className='div-label-attached' size='large'>
            <Icon name='users' size='large' inverted/> Gestión de Usuarios
          </Label>
          <Table compact celled definition attached='top' className='div-table'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='5'>
                  <ComponentAddUsers allUsers = { this.allUsers } endpoint = { this.props.endpoint }/>
                </Table.HeaderCell>
              </Table.Row>

              { 
                (this.state.usuarios.length > 0) ? 
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Nombre</Table.HeaderCell>
                  <Table.HeaderCell>Correo Electronico</Table.HeaderCell>
                  <Table.HeaderCell>Rol</Table.HeaderCell>
                  <Table.HeaderCell className='cell-logs'>Logs</Table.HeaderCell>
                  <Table.HeaderCell className='cell-acciones'>Acciones</Table.HeaderCell>
                </Table.Row> : ''
              }
            </Table.Header>

            <Table.Body>
              { this.state.usuarios.map(usuario => {
                  return(
                    <Table.Row key={usuario._id}> 
                      <Table.Cell collapsing>
                        <Icon name='user' />
                      </Table.Cell>
                      <Table.Cell>{usuario.nombre}</Table.Cell>
                      <Table.Cell>{usuario.email}</Table.Cell>
                      <Table.Cell>{usuario.rol}</Table.Cell>
                      <Table.Cell className='cell-logs' collapsing>
                        <Popup
                          content="Logs de acceso del usuario" basic inverted size='small' 
                          trigger={
                            <Button icon labelPosition='right' className='button-logs'>
                              <Icon name='address card outline' className='button-icon-logs'/>Logs
                            </Button> 
                          }
                        />
                      </Table.Cell>
                      <Table.Cell className='cell-acciones' collapsing>
                        <Popup
                          content="Eliminar el usuario" basic inverted size='small'
                          trigger={
                            <Button icon='remove user' className = 'button-remove' onClick={() => this.deleteUser(usuario._id, usuario.nombre) }/>
                          }
                        />
                        <Popup
                          content="Modificar el usuario" basic inverted size='small'
                          trigger={
                            <Button icon='edit' className='button-edit' onClick={() => this.updateUser(usuario._id, usuario.nombre) }/>
                          }
                        />
                        <Popup
                          content="Cambiar contraseña" basic inverted size='small'
                          trigger={
                            <Button icon='key' className='button-change-password'/>
                          }
                        />
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

export default ComponentUsers;