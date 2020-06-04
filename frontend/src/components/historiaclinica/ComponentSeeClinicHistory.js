//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'

//CSS
import '../global/css/Gestionar.css';

class ComponentSeeClinicHistory extends Component {
    state = {
      openModal: false,
      areaDeSalud: '', 
      numerohistoria: '', 
      vacunaAntiD : false, 
      numeroDeEmbarazos: 0, 
      numeroDePartos: 0, 
      numeroDeAbortos: 0, 
      paciente: '',
      opcionPacientes: [],
      activo: true,
      errorareaDeSalud: false,
      errornumerohistoria: false,
      errorpaciente: false,
      errorform: false
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
  
      this.setState({ 
        errorareaDeSalud: false,
        errornumerohistoria: false,
        errorpaciente: false,
        errform: false
      });
  
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
      if (evt.target.className.includes('modal-button-action') || evt.target.className.includes('modal-icon')) {
        this.clearModalState();
        this.setState({
          openModal: true,
          areaDeSalud: this.props.historiaclinica.areaDeSalud, 
          numerohistoria: this.props.historiaclinica.numerohistoria, 
          vacunaAntiD : this.props.historiaclinica.vacunaAntiD, 
          numeroDeEmbarazos: this.props.historiaclinica.numeroDeEmbarazos, 
          numeroDePartos: this.props.historiaclinica.numeroDePartos, 
          numeroDeAbortos: this.props.historiaclinica.numeroDeAbortos, 
          paciente: this.props.historiaclinica.paciente,
          activo: this.props.historiaclinica.activo
        });
      } else if(evt.target.className.includes('modal-button-cancel')){
        this.clearModalState();
      } else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          this.clearModalState();
        }
      }
    }
    //limpiar states
    clearModalState = () => {
      let opcion = [];
      
      this.props.pacientes.forEach(p => {
        //validacion si el paciente tiene una historia no se debe de mostrar
        //en caso de que sea mayor que cero
        if (this.props.historiasclinicas) {
          //busco los pacientes que no tengan historias validas
          if (this.props.historiasclinicas.find(history => history === p.historiaclinica)) {
            let nombreyapellidos = p.nombre + ' ' + p.apellidos;
            let cur = { key: p._id, text: nombreyapellidos, value: p._id, icon: 'wheelchair' };
            opcion = [...opcion, cur];
          }
        }else{
          let nombreyapellidos = p.nombre + ' ' + p.apellidos;
          let cur = { key: p._id, text: nombreyapellidos, value: p._id, icon: 'wheelchair' };
          opcion = [...opcion, cur];
        }
      });
      this.setState({
        openModal: false,
        areaDeSalud: '', 
        numerohistoria: '', 
        vacunaAntiD : false, 
        numeroDeEmbarazos: 0, 
        numeroDePartos: 0, 
        numeroDeAbortos: 0, 
        paciente: '',
        opcionPacientes: opcion,
        activo: true,
        errorareaDeSalud: false,
        errornumerohistoria: false,
        errorpaciente: false,
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
            <Header icon='clipboard' content='Modificar  ' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
                <Form.Input
                  required disabled name = 'numerohistoria' icon = 'address card outline' iconPosition = 'left' label = 'Numero de Historia:' value={this.state.numerohistoria}
                />
                <Segment.Group horizontal className='modal-segment-group'>
                  <Segment className='modal-segment-longleft'>
                    <Form.Input
                    name = 'areaDeSalud' icon = 'hospital symbol' iconPosition = 'left' label = 'Area de Salud:' value={this.state.areaDeSalud} placeholder = 'Consultorio, Policlinico, Hospital'
                    />
                  </Segment>
                  <Segment className='modal-segment-shortright'>
                    <Form.Group>
                      <Segment className='modal-segment-expanded'>
                        <Header as='h5'>Vacuna Anti-D:</Header>
                        <Form.Checkbox
                            toggle name='vacunaAntiD' labelPosition='left' label = {this.state.vacunaAntiD === true ? 'Si' : 'No'} value={this.state.vacunaAntiD}
                        />
                      </Segment>
                    </Form.Group>
                  </Segment>
                </Segment.Group>
                <Segment.Group horizontal>
                  <Segment>
                    <Form.Group>
                      <Form.Input className='modal-input-30p'
                        required name = 'numeroDeEmbarazos' icon = 'user md' iconPosition = 'left' label = 'Numero de Embarazos:' value={this.state.numeroDeEmbarazos}
                      />
                      <Button.Group>
                        <Button className='button-group-addsub' icon='plus' primary />
                        <Button className='button-group-addsub' icon='minus' secondary />
                      </Button.Group>
                    </Form.Group>
                  </Segment>
                  <Segment>
                    <Form.Group>
                      <Form.Input className='modal-input-30p'
                        required name = 'numeroDePartos' icon = 'user md' iconPosition = 'left' label = 'Numero de Partos:' value={this.state.numeroDePartos} 
                      />
                      <Button.Group>
                        <Button className='button-group-addsub' icon='plus' primary />
                        <Button className='button-group-addsub' icon='minus' secondary />
                      </Button.Group>
                    </Form.Group>
                  </Segment>
                  <Segment>
                    <Form.Group>
                      <Form.Input className='modal-input-30p'
                        required name = 'numeroDeAbortos' icon = 'user md' iconPosition = 'left' label = 'Numero de Abortos:' value={this.state.numeroDeAbortos}
                      />
                      <Button.Group>
                        <Button className='button-group-addsub' icon='plus' primary />
                        <Button className='button-group-addsub' icon='minus' secondary />
                      </Button.Group>
                    </Form.Group>
                  </Segment>
                </Segment.Group>
                <Form.Select
                    name = 'paciente' label = 'Paciente:' placeholder = 'Seleccionar Paciente' options={this.state.opcionPacientes} value={this.state.paciente._id} fluid selection clearable
                />
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                  <Icon name='remove' /> Cancelar
              </Button>
              {/* <Button color='green' onClick={this.changeModalState} className='modal-button-acept' type='submit' disabled={
                  (!this.state.numerohistoria || !this.state.areaDeSalud || !this.state.paciente)
              }>
                  <Icon name='checkmark' /> Aceptar
              </Button> */}
            </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentSeeClinicHistory;