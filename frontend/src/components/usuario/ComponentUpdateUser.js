//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentUpdateUser extends Component {
    state = {
      openModal: false,
      nombre: '',
      email: '',
      rol: '',
      activo: false,
      erroremail: false,
      errorrol: false,
      errorform: false
    }
    
    //constructor
    constructor(props) {
      super(props);
  
      this.clearModalState = this.clearModalState.bind(this);
      this.updateUser = this.updateUser.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    //modificar usuario
    updateUser = async (id) => {
      const { email, rol, activo } = this.state;
      const usuario = {
        email: email, 
        rol: rol,
        activo: activo
      }
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.parentState.endpoint + 'api/usuario/' + id, {
            method: 'PATCH',
            body: JSON.stringify(usuario),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'access-token' : this.props.parentState.token
            }
        })
        let jsondata = await res.json();
        const { status, message } = jsondata;
        if (status === 200) {
          Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 }); //mostrar mensaje
          return true;
        }
        else {
          Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 }); //mostrar mensaje
          return false;
        }
      } catch (err) {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
        return false;
      }
    }
    //validar el formulario
    handleSubmit = (evt) => {
      evt.preventDefault();
  
      this.setState({ errform: false });
  
      let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/; 
  
      let erroremail = (!this.state.email.match(mailformat)) ? { content: 'Formato de correo incorrecto (corre@host.dominio)', pointing: 'below' } : false;
      let errorrol = (this.state.rol === '') ? { content: 'Debe de escoger un rol', pointing: 'below' } : false;
      let eemail = Boolean(erroremail);
      let erol = Boolean(errorrol);
  
      let errform = (eemail || erol);
  
      this.setState({ 
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
      if (evt.target.className.includes('modal-button-action') || evt.target.className.includes('modal-icon')) {
        // this.getUser(this.props.usuario._id);
        this.setState({
          nombre: this.props.usuario.nombre,
          email: this.props.usuario.email,
          rol: this.props.usuario.rol,
          activo: this.props.usuario.activo,
          openModal: true
        });
      } else if ((evt.target.className.includes('modal-button-cancel')) || (evt.target.className.includes('modal-icon-cancel'))){
        this.clearModalState();
      } else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.updateUser(this.props.usuario._id)){
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
        email: '',
        rol: '',
        erroremail: false,
        errorrol: false,
        errorform: false
      });
    }
  
    render() {
      return (
        <Modal open={this.state.openModal}
            trigger = {
                <Button className='modal-button-action' onClick={this.changeModalState} >
                  <Icon name='edit' className='modal-icon' onClick={this.changeModalState}/>
                </Button>
            }
        >
            <Header icon='user' content='Modificar Usuario' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
                <Form.Input 
                  disabled required name = 'nombre' icon = 'user' iconPosition = 'left' label = 'Nombre:' value={this.state.nombre} error={this.state.errornombre} placeholder = 'nombre de usuario' onChange = {this.changeModalInput}
                />
                <Form.Input
                  required name = 'email' icon = 'mail' iconPosition = 'left' label = 'Correo Electrónico:' value={this.state.email} error={this.state.erroremail} placeholder = 'correo@host.com' onChange = {this.changeModalInput}
                />
                <Form.Select
                  required name = 'rol' label = 'Rol:' placeholder = 'Seleccionar Rol' options={this.props.roles} value={this.state.rol} error={this.state.errorrol} onChange = { (e, {value}) => { this.setState({ rol : value }); } } fluid selection clearable
                />
                <Form.Group>
                  <Segment className='modal-segment-expanded'>
                    <Header as='h5'>Activo:</Header>
                    <Form.Checkbox
                      toggle name='activo' labelPosition='left' label = {this.state.activo === true ? 'Si' : 'No'} value={this.state.activo} checked={this.state.activo} onChange = {(evt) => {
                        evt.preventDefault();
                        this.setState({
                          activo: !this.state.activo
                        });
                    }}
                    />
                  </Segment>
                </Form.Group>
            </Form>
            </Modal.Content>
            <Modal.Actions>
            <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                <Icon name='remove' className='modal-icon-cancel' /> Cancelar
            </Button>
            <Button color='green' onClick={this.changeModalState} className='modal-button-acept' type='submit' disabled={
                (!this.state.nombre || !this.state.email || !this.state.rol)
            }>
                <Icon name='checkmark' /> Aceptar
            </Button>
            </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentUpdateUser;