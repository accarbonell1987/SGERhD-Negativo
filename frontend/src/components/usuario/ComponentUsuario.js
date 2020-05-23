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
    nombre: '',
    contraseña: '',
    repetircontraseña: '',
    email: '',
    rol: '',
    errornombre: false,
    errorcontraseña: false,
    errorcontraseñacoincide: false,
    erroremail: false,
    errorrol: false
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

    this.addUser = this.addUser.bind(this);
    this.changeModalInput = this.changeModalInput.bind(this);
    this.changeModalState = this.changeModalState.bind(this);
    this.clearUserStateAndCloseModal = this.clearUserStateAndCloseModal.bind(this);
  }

  componentDidMount = () => {
    this.getAllUsers();
  }

  componentWillUpdate() {
    //console.log(this.state);
  }

  //adicionar nuevo usuario
  addUser = (evt) => {
    const {nombre, contraseña, repetircontraseña, email, rol } = this.state;
    console.log(this.state);
    const usuario = {
      nombre: nombre, contraseña: contraseña, repetircontraseña: repetircontraseña, email: email, rol: rol
    }
    console.log(usuario);

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
        Swal.fire({ position: 'center', icon: 'success', title: 'Usuario adicionado', showConfirmButton: false, timer: 3000 }); //mostrar mensaje
      }else{
        Swal.fire({ position: 'center', icon: 'error', title: message.message, showConfirmButton: false, timer: 5000 }); //mostrar mensaje
      }
    }).catch(err => {
      Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
    });
  }

  //obtener todos los usuarios desde la API
  getAllUsers = () => {
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

  //Actualiza los inputs con los valores que vamos escribiendo
  changeModalInput = (evt) => {
    const { name, value } = evt.target;
    
    this.setState({
      [name] : value
    });
  }

  //Limpia el usuario y cierra el modal
  clearUserStateAndCloseModal = () => {
    this.setState({
      nombre: '',
      contraseña: '',
      repetircontraseña: '',
      email: '',
      rol: '',
      openModal: false
    });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    let error = false;
    this.setState({ erroremail: error = ((this.state.email === '')||(!this.state.email.match(''))) });
    this.setState({ erroremail: error = (this.state.email === '') });
  }

  //cambiar el estado en el MODAL para adicionar usuario
  changeModalState = (evt) => {
    if (evt.target.className.includes('modal-button-add')) {
      this.setState({ openModal: true });
    }else if(evt.target.className.includes('modal-button-cancel')){
      this.clearUserStateAndCloseModal();
    }else {
      //this.addUser();
      //this.clearUserStateAndCloseModal();
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
                      <Form ref='form' onSubmit={this.onSubmit}>
                        <Form.Input
                          name = 'nombre'
                          icon = 'user'
                          iconPosition = 'left'
                          label = 'Nombre:'
                          placeholder = 'nombre de usuario'
                          error={this.state.errornombre}
                          onChange = {this.changeModalInput}
                        />
                        <Form.Input
                          name = 'email'
                          icon = 'mail'
                          iconPosition = 'left'
                          label = 'Correo Electrónico:'
                          value={this.state.email}
                          error={this.state.erroremail}
                          placeholder = 'correo@host.com'
                          onChange = {this.changeModalInput}
                        />
                        <Form.Select 
                          name = 'rol'
                          // iconPosition = 'left'
                          label = 'Rol:'
                          placeholder = 'Seleccionar Rol'
                          options={this.roles}
                          error={this.state.errorrol}
                          onChange = {(e, {value}) => {
                              this.setState({
                                rol : value
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
                            value={this.state.contraseña}
                            error={this.state.contraseña || this.state.errorcontraseñacoincide}
                            type='password'
                            onChange = {this.changeModalInput}
                        />
                        <Form.Input
                            name='repetircontraseña'
                            icon='lock'
                            iconPosition='left'
                            label='Repetir Contraseña:'
                            value={this.state.repetircontraseña}
                            error={this.state.repetircontraseña || this.state.errorcontraseñacoincide}
                            type='password'
                            onChange = {this.changeModalInput}
                        />
                      </Form>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color='red' onClick={this.changeModalState} className='modal-button-cancel'>
                        <Icon name='remove' /> Cancelar
                      </Button>
                      <Button color='green' onClick={this.changeModalState} className='modal-button-acept' type='submit' disabled={
                        !this.state.nombre ||
                        !this.state.email ||
                        !this.state.rol ||
                        !this.state.contraseña ||
                        !this.state.repetircontraseña
                      }>
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
