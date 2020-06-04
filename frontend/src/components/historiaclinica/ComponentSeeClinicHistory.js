//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Segment } from 'semantic-ui-react'

//CSS
import '../global/css/Gestionar.css';

//Componentes
import ComponentAddClinicHistory from './ComponentAddClinicHistory';

class ComponentSeeClinicHistory extends Component {
    state = {
      openModal: false,
      opcionPacientes: []
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
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    //validar el formulario
    handleSubmit = (evt) => {
      evt.preventDefault();
      return false;
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
      if (evt.target.className.includes('button-childs') || evt.target.className.includes('button-icon-childs')) {
        this.clearModalState();
        this.setState({
          openModal: true
        });
      } else if(evt.target.className.includes('modal-button-cancel')){
        this.clearModalState();
      } else {
          this.clearModalState();
      }
    }
    //limpiar states
    clearModalState = () => {
      let opcion = [];
      
      let nombreyapellidos = this.props.paciente.nombre + ' ' + this.props.paciente.apellidos;
      let cur = { key: this.props.paciente._id, text: nombreyapellidos, value: this.props.paciente._id, icon: 'wheelchair' };
      opcion = [...opcion, cur];

      this.setState({
        openModal: false,
        opcionPacientes: opcion
      });
    }
  
    render() {
      const historia = this.props.paciente.historiaclinica;
      //buscar el permiso del rol
      if (historia != null) {
        return (
          <Modal open={this.state.openModal}
              trigger = {
                <Button icon labelPosition='right' className='button-childs' onClick={this.changeModalState} >
                  <Icon name='eye' className='button-icon-childs' onClick={this.changeModalState}/>{historia.numerohistoria}
                </Button>
              }
          >
              <Header icon='clipboard' content='Detalles  ' />
              <Modal.Content>
              <Form ref='form' >
                  <Form.Input
                    name = 'numerohistoria' icon = 'address card outline' iconPosition = 'left' label = 'Numero de Historia:' 
                    value={historia.numerohistoria}
                  />
                  <Segment.Group horizontal className='modal-segment-group'>
                    <Segment className='modal-segment-longleft'>
                      <Form.Input
                      name = 'areaDeSalud' icon = 'hospital symbol' iconPosition = 'left' label = 'Area de Salud:' value={historia.areaDeSalud} placeholder = 'Consultorio, Policlinico, Hospital'
                      />
                    </Segment>
                    <Segment className='modal-segment-shortright'>
                      <Form.Group>
                        <Segment className='modal-segment-expanded'>
                          <Header as='h5'>Vacuna Anti-D:</Header>
                          <Form.Checkbox
                              toggle name='vacunaAntiD' labelPosition='left' label = {historia.vacunaAntiD === true ? 'Si' : 'No'} value={historia.vacunaAntiD} readOnly
                          />
                        </Segment>
                      </Form.Group>
                    </Segment>
                  </Segment.Group>
                  <Segment.Group horizontal>
                    <Segment>
                      <Form.Group>
                        <Form.Input className='modal-input-60p' 
                          name = 'numeroDeEmbarazos' icon = 'user md' iconPosition = 'left' label = 'Numero de Embarazos:' value={historia.numeroDeEmbarazos}
                        />
                      </Form.Group>
                    </Segment>
                    <Segment>
                      <Form.Group>
                        <Form.Input className='modal-input-60p' 
                          name = 'numeroDePartos' icon = 'user md' iconPosition = 'left' label = 'Numero de Partos:' value={historia.numeroDePartos} 
                        />
                      </Form.Group>
                    </Segment>
                    <Segment>
                      <Form.Group>
                        <Form.Input className='modal-input-60p' 
                          name = 'numeroDeAbortos' icon = 'user md' iconPosition = 'left' label = 'Numero de Abortos:' value={historia.numeroDeAbortos}
                        />
                      </Form.Group>
                    </Segment>
                  </Segment.Group>
                  <Form.Select
                    name = 'paciente' label = 'Paciente:' placeholder = 'Seleccionar Paciente' options={this.state.opcionPacientes} value={this.props.paciente._id} fluid selection
                />
              </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                    <Icon name='remove' /> Cancelar
                </Button>
              </Modal.Actions>
          </Modal>
        );
      } else return (
        <ComponentAddClinicHistory allClinicsHistory = {this.props.allClinicsHistory}  allPatients={this.props.allPatients} parentState = {this.props.parentState} roles = {this.props.roles} pacientes = {this.props.pacientes} historiasclinicas = {this.props.historiasclinicas} cambiarIcono = {true} paciente = {this.props.paciente} permisos = {this.props.permisos} />
      );
    }
  }
  
  export default ComponentSeeClinicHistory;