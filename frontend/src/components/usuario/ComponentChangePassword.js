//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Divider } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentChangePassword extends Component {
    state = {
      openModal: false,
      contraseña: '',
      repetircontraseña: '',
      contraseñaanterior: '',
      errorcontraseña: false,
      errorcontraseñacoincide: false,
      errorcontraseñaanterior: false,
      errorform: false,
      usuariocontraseña: ''
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
      const { contraseña } = this.state;
      const usuario = { contraseña }
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.parentState.endpoint + 'api/usuario/password/' + id, {
            method: 'PATCH',
            body: JSON.stringify(usuario),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'access-token': this.props.parentState.token
            }
        })
        let jsondata = await res.json();
        const { status, message } = jsondata;
        if (status === 200) {
          Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 });
          return true;
        }
        else {
          Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 });
          return false;
        }
      } catch (err) {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
        return false;
      }
    }
    //validar el formulario
    handleSubmit = (evt) => {
      evt.preventDefault();
  
      this.setState({ errform: false });

      let errorcontraseñaanterior = (this.state.contraseñaanterior.length < 8) ? { content: 'La contraseña debe de tener mas de 8 caracteres', pointing: 'below' } : false;
      let errorcontraseña = (this.state.contraseña.length < 8) ? { content: 'La contraseña debe de tener mas de 8 caracteres', pointing: 'below' } : false;
      let errorcontraseñacoincide = (this.state.repetircontraseña !== this.state.contraseña) ? { content: 'La contraseñas no coinciden', pointing: 'below' } : false;

      let eerrorcontraseñaanterior = Boolean(errorcontraseñaanterior);
      let econtraseña = Boolean(errorcontraseña);
      let econtraseñacoincide = Boolean(errorcontraseñacoincide);

      let errform = false;
      if (this.props.gestion) 
        errform = (econtraseña || econtraseñacoincide);
      else 
        errform = (econtraseña || econtraseñacoincide || eerrorcontraseñaanterior);
  
      this.setState({ 
        errorcontraseñaanterior: errorcontraseñaanterior,
        errorcontraseña: errorcontraseña,
        errorcontraseñacoincide: errorcontraseñacoincide,
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
      if (evt.target.className.includes('modal-button-change-password') || evt.target.className.includes('modal-icon')) {
        this.setState({ openModal: true });
      }else if(evt.target.className.includes('modal-button-cancel')){
        this.clearModalState();
      }else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //chequear si se abrio el componente desde el gestionar o desde el cambiar clave de usuario
          if (!this.props.gestion) {
            //buscar la contraseña antigua del usuario en caso de que sea igual a null o vacio
            if (this.state.usuariocontraseña === '') this.getUser(this.props.usuario._id);
            //comparar las contraseñas antiguas == actual
            if (this.state.usuariocontraseña === this.state.contraseñaanterior) {
              //si no hay problemas modificando
              if (await this.updateUser(this.props.usuario._id)){
                this.clearModalState();
              }
            }else{
              this.setState({ 
                errorcontraseñaanterior: { content: 'Las contraseña antigua no coincide con la del usuario', pointing: 'below' },
                errorform: true
              });
              Swal.fire({ position: 'center', icon: 'error', title: 'Las contraseña antigua no coincide con la del usuario', showConfirmButton: false, timer: 5000 });
            }
          }else{
            //si no hay problemas modificando
            if (await this.updateUser(this.props.usuario._id)){
              this.clearModalState();
            }
          }
        }
      }
    }
    //limpiar states
    clearModalState = () => {
      this.setState({
        openModal: false,
        contraseña: '',
        repetircontraseña: '',
        contraseñaanterior: '',
        errorcontraseña: false,
        errorcontraseñacoincide: false,
        errorcontraseñaanterior: false,
        errorform: false,
        usuariocontraseña: ''
      });
    }
  
    render() {
      return (
        <Modal open={this.state.openModal}
            trigger = {
                <Button className='modal-button-change-password' onClick={this.changeModalState} >
                  <Icon name='key' className='modal-icon' onClick={this.changeModalState}/>
                </Button>
            }
        >
            <Header icon='user' content='Cambiar Contraseña  ' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
              {
                (!this.props.gestion) ? 
                <div>
                  <Form.Input
                    required name='contraseñaanterior' icon='lock' iconPosition='left' label='Contraseña Anterior:' value={this.state.contraseñaanterior} error={this.state.errorcontraseñaanterior} type='password' onChange = {this.changeModalInput}
                  />
                  <Divider hidden />
                  <Divider horizontal>
                    <Header as='h4'>
                      <Icon name='key' />Nuevos Datos
                    </Header>
                  </Divider>
                </div>
                 : ''
              }
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
                <Icon name='remove' /> Cancelar
            </Button>
            { this.props.gestion ? 
              <Button color='green' onClick={this.changeModalState} className='modal-button-acept' type='submit' disabled={
                  (!this.state.contraseña || !this.state.repetircontraseña)
                }>
                <Icon name='checkmark' /> Aceptar
              </Button> 
              :
              <Button color='green' onClick={this.changeModalState} className='modal-button-acept' type='submit' disabled={
                  (!this.state.contraseñaanterior || !this.state.contraseña || !this.state.repetircontraseña)
                }>
                <Icon name='checkmark' /> Aceptar
              </Button>
            }
            </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentChangePassword;