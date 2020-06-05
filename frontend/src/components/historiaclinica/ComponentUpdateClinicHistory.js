//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentUpdateClinicHistory extends Component {
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
      this.updateClinicHistory = this.updateClinicHistory.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    //modificar paciente
    updateClinicHistory = async (id) => {
      const { areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = this.state;

      const fecha = new Date();
      const historiaclinica = {
        fechaDeCreacion: fecha, areaDeSalud: areaDeSalud, numerohistoria: numerohistoria, vacunaAntiD: vacunaAntiD, numeroDeEmbarazos: numeroDeEmbarazos, numeroDePartos: numeroDePartos, numeroDeAbortos: numeroDeAbortos, paciente: paciente,activo: activo
      }
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.parentState.endpoint + 'api/historiaclinica/' + id, {
            method: 'PATCH',
            body: JSON.stringify(historiaclinica),
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
      } else if ((evt.target.className.includes('modal-button-cancel')) || (evt.target.className.includes('modal-icon-cancel'))){
        this.clearModalState();
      } else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.updateClinicHistory(this.props.historiaclinica._id)){
            //enviar a recargar los usuarios
            this.props.allClinicsHistory();
            this.clearModalState();
          }
        }
      }
    }
    //limpiar states
    clearModalState = () => {
      let opcion = [];
      this.props.pacientes.forEach(p => {
        //validacion si el paciente tiene una historia no se debe de mostrar
        //en caso de que sea mayor que cero
        if (this.props.historiasclinicas.length > 0) {
          //busco los pacientes que no tengan historias validas
          if (!this.props.historiasclinicas.some(h => h.paciente._id === p._id) || (this.props.historiaclinica.paciente._id === p._id)) {
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
            <Header icon='clipboard' content='Modificar Paciente' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
                <Form.Input
                  required disabled name = 'numerohistoria' icon = 'address card outline' iconPosition = 'left' label = 'Numero de Historia:' value={this.state.numerohistoria}
                />
                <Segment.Group horizontal className='modal-segment-group'>
                  <Segment className='modal-segment-longleft'>
                    <Form.Input
                    required name = 'areaDeSalud' icon = 'hospital symbol' iconPosition = 'left' label = 'Area de Salud:' value={this.state.areaDeSalud} placeholder = 'Consultorio, Policlinico, Hospital' onChange = {this.changeModalInput}
                    />
                  </Segment>
                  <Segment className='modal-segment-shortright'>
                    <Form.Group>
                      <Segment className='modal-segment-expanded'>
                        <Header as='h5'>Vacuna Anti-D:</Header>
                        <Form.Checkbox
                            toggle name='vacunaAntiD' labelPosition='left' label = {this.state.vacunaAntiD === true ? 'Si' : 'No'} value={this.state.vacunaAntiD} onChange = {(evt) => {
                            evt.preventDefault();
                            this.setState({
                              vacunaAntiD: !this.state.vacunaAntiD
                            });
                          }}
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
                        <Button className='button-group-addsub' icon='plus' primary onClick={(evt) => { 
                          evt.preventDefault();
                          this.setState({numeroDeEmbarazos: this.state.numeroDeEmbarazos + 1 }); 
                        }} />
                        <Button className='button-group-addsub' icon='minus' secondary disabled={this.state.numeroDeEmbarazos === 0} onClick={(evt) => { 
                          evt.preventDefault();
                          this.setState({numeroDeEmbarazos: this.state.numeroDeEmbarazos - 1 }); 
                        }} />
                      </Button.Group>
                    </Form.Group>
                  </Segment>
                  <Segment>
                    <Form.Group>
                      <Form.Input className='modal-input-30p'
                        required name = 'numeroDePartos' icon = 'user md' iconPosition = 'left' label = 'Numero de Partos:' value={this.state.numeroDePartos} 
                      />
                      <Button.Group>
                        <Button className='button-group-addsub' icon='plus' primary onClick={(evt) => { 
                          evt.preventDefault();
                          this.setState({numeroDePartos: this.state.numeroDePartos + 1 }); 
                        }} />
                        <Button className='button-group-addsub' icon='minus' secondary disabled={this.state.numeroDePartos === 0} onClick={(evt) => { 
                          evt.preventDefault();
                          this.setState({numeroDePartos: this.state.numeroDePartos - 1 }); 
                        }} />
                      </Button.Group>
                    </Form.Group>
                  </Segment>
                  <Segment>
                    <Form.Group>
                      <Form.Input className='modal-input-30p'
                        required name = 'numeroDeAbortos' icon = 'user md' iconPosition = 'left' label = 'Numero de Abortos:' value={this.state.numeroDeAbortos}
                      />
                      <Button.Group>
                        <Button className='button-group-addsub' icon='plus' primary onClick={(evt) => { 
                          evt.preventDefault();
                          this.setState({numeroDeAbortos: this.state.numeroDeAbortos + 1 }); 
                        }} />
                        <Button className='button-group-addsub' icon='minus' secondary disabled={this.state.numeroDeAbortos === 0} onClick={(evt) => { 
                          evt.preventDefault();
                          this.setState({numeroDeAbortos: this.state.numeroDeAbortos - 1 }); 
                        }} />
                      </Button.Group>
                    </Form.Group>
                  </Segment>
                </Segment.Group>
                <Form.Select
                    name = 'paciente' label = 'Paciente:' placeholder = 'Seleccionar Paciente' options={this.state.opcionPacientes} value={this.state.paciente._id} onChange = { (e, {value}) => { this.setState({ paciente : value }); } } fluid selection clearable
                />
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                  <Icon name='remove' className='modal-icon-cancel' /> Cancelar
              </Button>
              <Button color='green' onClick={this.changeModalState} className='modal-button-accept' type='submit' disabled={
                  (!this.state.numerohistoria || !this.state.areaDeSalud || !this.state.paciente)
              }>
                  <Icon name='checkmark' /> Aceptar
              </Button>
            </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentUpdateClinicHistory;