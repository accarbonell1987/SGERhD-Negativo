//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentAddUser extends Component {
    state = {
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
      errorrol: false,
      errorform: false
    }
  
    constructor(props) {
      super(props);
  
      this.addUser = this.addUser.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
      this.clearModalState = this.clearModalState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    //componente se monto
    componentDidMount() {
        this.clearModalState();
    }

    //adicionar nuevo usuario
    addUser = async () => {
      const { nombre, contraseña, repetircontraseña, email, rol } = this.state;
      const usuario = {
        nombre: nombre, contraseña: contraseña, repetircontraseña: repetircontraseña, email: email, rol: rol
      }
      //la promise debe de devolver un valor RETURN
      try {
            const res = await fetch(this.props.parentState.endpoint + 'api/usuario/', {
                method: 'POST',
                body: JSON.stringify(usuario),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'access-token': this.props.parentState.token
                }
            });
            let data = await res.json();
            //capturar respuesta
            const { status, message } = data;
            if (status === 200) {
                this.clearModalState();
                Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 }); //mostrar mensaje
                return true;
            }
            else {
                Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 }); //mostrar mensaje
                return false;
            }
        }
        catch (err) {
            Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
            return false;
        }
    }
    //validar el formulario
    handleSubmit = (evt) => {
      evt.preventDefault();
  
      this.setState({ errform: false });
  
      let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/; 
  
      let errorcontraseña = (this.state.contraseña.length < 8) ? { content: 'La contraseña debe de tener mas de 8 caracteres', pointing: 'below' } : false;
      let errorcontraseñacoincide = (this.state.repetircontraseña !== this.state.contraseña) ? { content: 'La contraseñas no coinciden', pointing: 'below' } : false;
      let erroremail = (!this.state.email.match(mailformat)) ? { content: 'Formato de correo incorrecto (corre@host.dominio)', pointing: 'below' } : false;
      let errorrol = (this.state.rol === '') ? { content: 'Debe de escoger un rol', pointing: 'below' } : false;
  
      let econtraseña = Boolean(errorcontraseña);
      let econtraseñacoincide = Boolean(errorcontraseñacoincide);
      let eemail = Boolean(erroremail);
      let erol = Boolean(errorrol);
  
      let errform = (econtraseña || econtraseñacoincide || eemail || erol);
  
      this.setState({ 
        errorcontraseña: errorcontraseña,
        errorcontraseñacoincide: errorcontraseñacoincide,
        erroremail: erroremail,
        errorrol: errorrol,
        errorform: errform
      });
  
      return errform;
    }
    //Actualiza los inputs con los valores que vamos escribiendo
    changeModalInput = (evt) => {
      const { name, value } = evt.target;
  
      this.setState({
        [name] : value
      });
    }
    //cambiar el estado en el MODAL para adicionar usuario
    changeModalState = async (evt) => {
      if (evt.target.className.includes('modal-button-add')) {
        this.setState({ openModal: true });
      } else if ((evt.target.className.includes('modal-button-cancel')) || (evt.target.className.includes('modal-icon-cancel'))){
        this.setState({ openModal: false });
      }else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.addUser()){
            //enviar a recargar los usuarios
            this.props.allUsers();
            this.clearModalState();
          }
        }
      }
    }
    //limpiar states
    clearModalState = () => {
        this.setState({
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
            errorrol: false,
            errorform: false
        });
    }
  
    render() {
      return (
        <Modal open={this.state.openModal}
            trigger = {
                <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.changeModalState} className='modal-button-add'>
                  <Icon name='add user' /> Adicionar
                </Button>
            }
        >
            <Header icon='user' content='Adicionar  ' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
                <Form.Input
                required name = 'nombre' icon = 'user' iconPosition = 'left' label = 'Nombre:' placeholder = 'nombre de usuario' error = { this.state.errornombre } onChange = {this.changeModalInput}
                />
                <Form.Input
                required name = 'email' icon = 'mail' iconPosition = 'left' label = 'Correo Electrónico:' value={this.state.email} error={this.state.erroremail} placeholder = 'correo@host.com' onChange = {this.changeModalInput}
                />
                <Form.Select
                required name = 'rol' label = 'Rol:' placeholder = 'Seleccionar Rol' options={this.props.roles} error={this.state.errorrol} onChange = { (e, {value}) => { this.setState({ rol : value }); } } fluid selection clearable
                />
                <Form.Input
                required name='contraseña' icon='lock' iconPosition='left' label='Contraseña:' value={this.state.contraseña} error={this.state.errorcontraseña} type='password' onChange = {this.changeModalInput}
                />
                <Form.Input 
                required name='repetircontraseña' icon='lock' iconPosition='left' label='Repetir Contraseña:' value={this.state.repetircontraseña} error={this.state.errorcontraseñacoincide} type='password' onChange = {this.changeModalInput}
                />
            </Form>
            </Modal.Content>
            <Modal.Actions>
            <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                <Icon name='remove' className='modal-icon-cancel' /> Cancelar
            </Button>
            <Button color='green' onClick={this.changeModalState} className='modal-button-acept' type='submit' disabled={
                (!this.state.nombre || !this.state.email || !this.state.rol || !this.state.contraseña || !this.state.repetircontraseña)
            }>
                <Icon name='checkmark' /> Aceptar
            </Button>
            </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentAddUser;