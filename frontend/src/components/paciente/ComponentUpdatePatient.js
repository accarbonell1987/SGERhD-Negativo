//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentUpdatePatient extends Component {
    state = {
      openModal: false,
      nombre: '',
      apellidos: '',
      ci: '',
      direccion: '',
      direccionopcional: '',
      telefono: '',
      sexo: '',
      madre: '',
      hijos: [],
      transfusiones: [],
      embarazos: [],
      examenes: [],
      activo: true,
      errornombre: false,
      errorapellidos: false,
      errorci: false,
      errordireccion: false,
      errortelefono: false,
      errorform: false,
    }

    generos = [
      { key: 'M', text: 'Masculino', value: 'M', icon: 'man' },
      { key: 'F', text: 'Femenino', value: 'F', icon: 'woman' }
    ];
    
    //constructor
    constructor(props) {
      super(props);
  
      this.clearModalState = this.clearModalState.bind(this);
      this.updatePatient = this.updatePatient.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    //modificar paciente
    updatePatient = async (id) => {
      const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, madre, hijos, transfusiones, embarazos, examenes, activo } = this.state;
      const paciente = {
        nombre: nombre,
        apellidos: apellidos,
        ci: ci,
        direccion: direccion,
        direccionopcional: direccionopcional,
        telefono: telefono,
        sexo: sexo,
        madre: madre,
        hijos: hijos,
        transfusiones: transfusiones,
        embarazos: embarazos,
        examenes: examenes,
        activo: activo
      }
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.parentState.endpoint + 'api/paciente/' + id, {
            method: 'PATCH',
            body: JSON.stringify(paciente),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'access-token' : this.props.parentState.token
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
        Swal.fire({ position: 'center', icon: 'error', title: err , showConfirmButton: false, timer: 5000 });
        return false;
      }
    }
    //validar el formulario
    handleSubmit = (evt) => {
      evt.preventDefault();
  
      this.setState({ errform: false });

      let soloLetras = /^[a-zA-Z ]+$/;
      let soloNumeros = /^([0-9])*$/;

      let errornombre = (!this.state.nombre.match(soloLetras)) ? { content: 'El nombre solo debe de contener letras', pointing: 'below' } : false;
      let errorapellidos = (!this.state.apellidos.match(soloLetras)) ? { content: 'Apellidos solo debe de contener letras', pointing: 'below' } : false;
      let errorci = (!this.state.ci.toString().match(soloNumeros) || this.state.ci.length !== 11) ? { content: 'El carnet de identidad solo debe de contener números y ser igual a 11 dígitos', pointing: 'below' } : false;
      let errortelefono = (!this.state.telefono.toString().match(soloNumeros)) ? { content: 'El teléfono solo debe de contener números', pointing: 'below' } : false;
  
      let enombre = Boolean(errornombre);
      let eapellidos = Boolean(errorapellidos);
      let eci = Boolean(errorci);
      let etelefono = Boolean(errortelefono);
  
      let errform = (enombre || eapellidos || eci || etelefono);
  
      this.setState({ 
        errornombre: errornombre,
        errorapellidos: errorapellidos,
        errorci: errorci,
        errortelefono: errortelefono,
        errform: errform
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
    //cambiar el estado en el MODAL para adicionar paciente
    changeModalState = async (evt) => {
      if (evt.target.className.includes('modal-button-action') || evt.target.className.includes('modal-icon')) {
        this.setState({
          openModal: true,
          nombre: this.props.paciente.nombre,
          apellidos: this.props.paciente.apellidos,
          ci: this.props.paciente.ci,
          direccion: this.props.paciente.direccion,
          direccionopcional: this.props.paciente.direccionopcional,
          telefono: this.props.paciente.telefono,
          sexo: this.props.paciente.sexo,
          madre: this.props.paciente.madre,
          hijos: this.props.paciente.hijos,
          transfusiones: this.props.paciente.transfusiones,
          embarazos: this.props.paciente.embarazos,
          examenes: this.props.paciente.examenes,
          activo: this.props.paciente.activo
        });
      } else if ((evt.target.className.includes('modal-button-cancel')) || (evt.target.className.includes('modal-icon-cancel'))){
        this.clearModalState();
      } else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.updatePatient(this.props.paciente._id)){
            //enviar a recargar los usuarios
            this.props.allPatients();
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
        apellidos: '',
        ci: '',
        direccion: '',
        direccionopcional: '',
        telefono: '',
        sexo: '',
        madre: '',
        hijos: [],
        transfusiones: [],
        embarazos: [],
        examenes: [],
        activo: true,
        errornombre: false,
        errorapellidos: false,
        errorci: false,
        errordireccion: false,
        errortelefono: false,
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
            <Header icon='wheelchair' content='Modificar Paciente' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
              <Form.Input
                required name = 'nombre' icon = 'address card outline' iconPosition = 'left' label = 'Nombre:' value={this.state.nombre} placeholder = 'Facundo' error = { this.state.errornombre } onChange = {this.changeModalInput}
              />
              <Form.Input
                required name = 'apellidos' icon = 'address card outline' iconPosition = 'left' label = 'Apellidos:' value={this.state.apellidos} error={this.state.errorapellidos} placeholder = 'Correcto Inseguro' onChange = {this.changeModalInput}
              />
              <Form.Input
                required name = 'ci' icon = 'vcard' iconPosition = 'left' label = 'Carnet de Identidad:' value={this.state.ci} placeholder = '90112050112' error = { this.state.errorci } onChange = {this.changeModalInput}
              />
              <Form.Input
                required name = 'direccion' icon = 'building outline' iconPosition = 'left' label = 'Dirección:' value={this.state.direccion} placeholder = 'Calle 6 No.512...' onChange = {this.changeModalInput}
              />
              <Form.Input
                name = 'direccionopcional' icon = 'building outline' iconPosition = 'left' label = 'Dirección Opcional:' value={this.state.direccionopcional} placeholder = 'Calle 6 No.512...' onChange = {this.changeModalInput}
              />
              <Form.Input
                required name = 'telefono' icon = 'phone' iconPosition = 'left' label = 'Teléfono:' value={this.state.telefono} placeholder = '52802640' onChange = {this.changeModalInput} error={this.state.errortelefono}
              />
              <Form.Select
                required name = 'sexo' label = 'Género:' placeholder = 'Seleccionar Género' options={this.generos} value={this.state.sexo} error={this.state.errorsexo} onChange = { (e, {value}) => { this.setState({ sexo : value }); } } fluid selection clearable
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
                  (!this.state.nombre || !this.state.apellidos || !this.state.ci || !this.state.direccion || !this.state.telefono ||!this.state.sexo)
              }>
                  <Icon name='checkmark' /> Aceptar
              </Button>
            </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentUpdatePatient;