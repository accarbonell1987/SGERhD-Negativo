//Importaciones
import React, { Component } from 'react';
import { Button, Grid, Icon, Label, Table, Image } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

//Componentes
import ComponentAddUser from './ComponentAddUser';
import ComponentUpdateUser from './ComponentUpdateUser';
import ComponentChangePassword from './ComponentChangePassword';


//Defincion de la clase
class ComponentUsers extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);
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
      cancelButtonColor: '#db2828',
      confirmButtonColor: '#21ba45',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      reverseButtons: true
    })
    .then((result) => {
      //si escogio Si
      if (result.value) {
        //enviar al endpoint
        fetch (this.props.parentState.endpoint + 'api/usuario/' + id, {
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
          //Actualizar el listado
          this.allUsers();
        })
        .catch(err => {
          Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
        });
      }
    })
  }

  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find(p => p.opcion === 'usuarios');
    //chequear si es usuario y tengo permiso
    return (
      <Grid textAlign='center' verticalAlign='top' className='gestionar-allgrid'>
        <Grid.Column className='gestionar-allcolumn'>
          <Label attached='top left' className='div-label-attached' size='large'>
            <Icon name='users' size='large' inverted/> Gestión de Usuarios
          </Label>
          <Table compact celled definition attached='top' className='div-table'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='5'>{
                  accesomenu.permisos.crear ?
                    <ComponentAddUser allUsers = {this.props.allUsers}  parentState = {this.props.parentState} roles = {this.props.roles} />:<Button floated='right' icon labelPosition='left' primary size='small' className='modal-button-add' disabled>
                      <Icon name='add user' /> Adicionar
                    </Button>
                }
                </Table.HeaderCell>
              </Table.Row> 
              { 
                (this.props.usuarios.length > 0) ? 
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Nombre</Table.HeaderCell>
                  <Table.HeaderCell>Correo Electrónico</Table.HeaderCell>
                  <Table.HeaderCell>Rol</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Logs</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Acciones</Table.HeaderCell>
                </Table.Row> : ''
              }
            </Table.Header>

            <Table.Body>
              { this.props.usuarios.map (usuario => {

                  let rolData = this.props.roles.find(element => { return element.key === usuario.rol });
                  //para colorear row
                  let negative = this.props.parentState.usuario === usuario.nombre || usuario.nombre === 'administrador';
                  return(
                    <Table.Row key={usuario._id} negative={negative}>
                      <Table.Cell collapsing>
                        <Icon name='user' />
                      </Table.Cell>
                      <Table.Cell>{usuario.nombre}</Table.Cell>
                      <Table.Cell>{usuario.email}</Table.Cell>
                      <Table.Cell>
                        <Label image size='medium'>
                          <Image src={ rolData.image.src } />{rolData.text}
                        </Label>
                      </Table.Cell>
                      <Table.Cell className='cell-logs' collapsing>
                        <Button icon labelPosition='right' className='button-logs'>
                          <Icon name='address card outline' className='button-icon-logs'/>Logs
                        </Button> 
                      </Table.Cell>
                      <Table.Cell className='cell-acciones' collapsing>
                        {
                          //acceso a eliminar
                          accesomenu.permisos.eliminar && !negative ?
                          <Button icon='remove user' className = 'button-remove' onClick={() => this.deleteUser(usuario._id, usuario.nombre) } /> : <Button icon='remove user' className = 'button-remove' disabled />
                        }
                        {
                          accesomenu.permisos.modificar ?
                          <ComponentUpdateUser allUsers = { this.props.allUsers } usuario = {usuario} parentState = {this.props.parentState} roles = {this.props.roles} /> :
                          <Button icon='edit' disabled />
                        }
                        {
                          this.props.parentState.rol === 'informatico' ?
                          <ComponentChangePassword parentState = {this.props.parentState} usuario = {usuario} gestion = {true} /> : <Button icon='key' disabled />
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

export default ComponentUsers;