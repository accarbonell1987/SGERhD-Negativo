//Importaciones
import React, { Component } from 'react';
import { Button, Grid, Icon, Label, Table, Popup, Header, Modal, Form } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Usuario.css';

//Defincion de la clase
class ComponentUsuarioListar extends Component {
  state = {
    usuarios: [],
    openModal: false,
    usuario : {
      nombre: '',
      contraseña: '',
      repetircontraseña: '',
      email: '',
      rol: ''
    }
  }

  roles = [
    { key: 'usuario', text: 'Usuario', value: 'usuario', image: { avatar: true, src: require('../global/images/patrick.png') }},
    { key: 'recepcionista', text: 'Recepcionista', value: 'recepcionista', image: { avatar: true, src: require('../global/images/christian.jpg') }},
    { key: 'informatico', text: 'Informatico', value: 'informatico' , image: { avatar: true, src: require('../global/images/elliot.jpg') }},
    { key: 'especialista', text: 'Especialista', value: 'especialista' , image: { avatar: true, src: require('../global/images/jenny.jpg') }},
    { key: 'doctor', text: 'Doctor', value: 'doctor', image: { avatar: true, src: require('../global/images/justen.jpg') }}
  ];

  constructor(props) {
    super(props);

    this.adicionarUsuario = this.adicionarUsuario.bind(this);
    this.changeModalInput = this.changeModalInput.bind(this);
    this.changeModalState = this.changeModalState.bind(this);
  }

  componentDidMount = () => {
    this.obtenerUsuarios();
  }

  adicionarUsuario = (evt, usuario) => {
    evt.preventDefault();

    fetch(this.props.endpoint + 'api/usuario/', {
      method: 'POST', //metodo
      body: JSON.stringify(usuario), //datos
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      //capturar respuesta
      const { status, message } = data;
      if (status === 'OK') {

        Swal.fire({ position: 'center', icon: 'success', title: 'Usuario adicionado', showConfirmButton: false, timer: 1500 }); //mostrar mensaje
      }else{
        Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 3000 }); //mostrar mensaje
      }
    }).catch(err => {
      Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 }); //mostrar mensaje de error
    });
  }

  obtenerUsuarios = () => {
    fetch(this.props.endpoint + 'api/usuario')
      .then(res => res.json())
      .then(data => {
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

  changeModalInput = (evt) => {
    const { name, value } = evt.target;
    
    this.setState({
      usuario: {[name] : value}
    });
  }

  changeModalState = (evt) => {
    if (evt.target.className.includes('modal-button-add')) {
      this.setState({ openModal: true });
    }else if(evt.target.className.includes('modal-button-cancel')){
      this.setState({ openModal: false });
    }
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
                  <Modal open={this.state.openModal}
                    trigger = {
                        <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.changeModalState} className='modal-button-add'>
                          <Icon name='add user' /> Adicionar
                        </Button>
                      }
                    >
                    <Header icon='user' content='Adicionar  ' />
                    <Modal.Content>
                      <Form>
                        <Form.Input
                          name = 'nombre'
                          icon = 'user'
                          iconPosition = 'left'
                          label = 'Nombre:'
                          placeholder = 'nombre de usuario'
                          value={this.state.usuario.nombre}
                          onChange = {this.changeModalInput}
                        />
                        <Form.Input
                          name = 'email'
                          icon = 'mail'
                          iconPosition = 'left'
                          label = 'Correo Electrónico:'
                          value={this.state.usuario.email}
                          placeholder = 'correo@host.com'
                          onChange = {this.changeModalInput}
                        />
                        <Form.Select 
                          name = 'rol'
                          // iconPosition = 'left'
                          label = 'Rol:'
                          placeholder = 'Seleccionar Rol'
                          options={this.roles}
                          onChange = {(e, {value}) => {
                              this.setState({
                                usuario: { rol : value}
                              });
                            }
                          }
                          fluid selection clearable
                        />
                        <Form.Input
                            name='contraseña'
                            icon='lock'
                            iconPosition='left'
                            label='Contraseña:'
                            value={this.state.usuario.contraseña}
                            type='password'
                            onChange = {this.changeModalInput}
                        />
                        <Form.Input
                            name='repetircontraseña'
                            icon='lock'
                            iconPosition='left'
                            label='Repetir Contraseña:'
                            value={this.state.usuario.repetircontraseña}
                            type='password'
                            onChange = {this.changeModalInput}
                        />
                      </Form>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color='red' onClick={this.changeModalState} className='modal-button-cancel'>
                        <Icon name='remove' /> Cancelar
                      </Button>
                      <Button color='green'>
                        <Icon name='checkmark' /> Aceptar
                      </Button>
                    </Modal.Actions>
                  </Modal>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Correo Electronico</Table.HeaderCell>
                <Table.HeaderCell>Rol</Table.HeaderCell>
                <Table.HeaderCell className='cell-logs'>Logs</Table.HeaderCell>
                <Table.HeaderCell className='cell-acciones'>Acciones</Table.HeaderCell>
              </Table.Row>
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
                            trigger={ <Button icon labelPosition='right' className='button-logs'>
                            <Icon name='address card outline' className='button-icon-logs'/>Logs
                          </Button> }
                            content="Logs de acceso del usuario"
                            basic inverted size='small'
                        />
                      </Table.Cell>
                      <Table.Cell className='cell-acciones' collapsing>
                        <Popup
                          trigger={<Button icon='remove user' className = 'button-remove' />}
                          content="Eliminar el usuario"
                          basic inverted size='small'
                        />
                        <Popup
                          trigger={<Button icon='edit' className='button-edit'/>}
                          content="Modificar el usuario"
                          basic inverted size='small'
                        />
                        <Popup
                          trigger={<Button icon='key' className='button-change-password'/>}
                          content="Cambiar contraseña"
                          basic inverted size='small'
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

export default ComponentUsuarioListar;
