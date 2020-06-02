//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message } from 'semantic-ui-react'
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
      examenes: []
    }

    generos = [
      { key: 'M', text: 'Masculino', value: 'M', icon: 'man' },
      { key: 'F', text: 'Femenino', value: 'F', icon: 'woman' }
    ];
    
    //constructor
    constructor(props) {
      super(props);
  
      this.clearModalState = this.clearModalState.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
    }

    //obtener propiedades del paciente
    getPatient = (id) => {
      //enviar al endpoint
      fetch (this.props.parentState.endpoint + 'api/paciente/' + id, {
        method: 'GET',
        headers: {
          'access-token' : this.props.parentState.token
        }
      })
      .then(res => res.json())
      .then(jsondata => {
        const { status, message, data } = jsondata;
        if (status === 200) {
          this.setState({
            openModal: true,
            nombre: data.nombre,
            apellidos: data.apellidos,
            ci: data.ci,
            direccion: data.direccion,
            direccionopcional: data.direccionopcional,
            telefono: data.telefono,
            sexo: data.sexo,
            madre: data.madre,
            hijos: data.hijos,
            transfusiones: data.transfusiones,
            embarazos: data.embarazos,
            examenes: data.examenes,
            activo: data.activo
          });
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
      });
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
        this.getPatient(this.props.pacienteid);
      }else if(evt.target.className.includes('modal-button-cancel')){
        this.clearModalState();
      }else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.updatePatient(this.props.pacienteid)){
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
        historiaclinica: '',
        madre: '',
        hijos: [],
        transfusiones: [],
        embarazos: [],
        examenes: []
      });
    }
  
    render() {
      return (
        <Modal open={this.state.openModal}
            trigger = {
                <Button className='modal-button-action' onClick={this.changeModalState} >
                  <Icon name='eye' className='modal-icon' onClick={this.changeModalState}/>{ this.props.paciente.historiaclinica !== null ? this.props.paciente.historiaclinica.numerohistoria : 'Vacia'}
                </Button>
            }
        >
            <Header icon='clipboard' content='Inspeccionar  ' />
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
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                  <Icon name='remove' /> Cancelar
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