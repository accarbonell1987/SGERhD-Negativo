//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentAddPatient extends Component {
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

    constructor(props) {
      super(props);
  
      this.addClinicHistory = this.addClinicHistory.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
      this.clearModalState = this.clearModalState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    //componente se monto
    componentDidMount() {
        this.clearModalState();
    }
    //adicionar nuevo paciente
    addClinicHistory = async () => {
      const { areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = this.state;

      const fecha = new Date();
      const historiaclinica = {
        fechaDeCreacion: fecha, areaDeSalud: areaDeSalud, numerohistoria: numerohistoria, vacunaAntiD: vacunaAntiD, numeroDeEmbarazos: numeroDeEmbarazos, numeroDePartos: numeroDePartos, numeroDeAbortos: numeroDeAbortos, paciente: paciente,activo: activo
      }
      //la promise debe de devolver un valor RETURN
      try {
            const res = await fetch(this.props.parentState.endpoint + 'api/historiaclinica/', {
                method: 'POST',
                body: JSON.stringify(historiaclinica),
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
                Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 });
                return true;
            }
            else {
                Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 });
                return false;
            }
        }
        catch (err) {
            Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
            return false;
        }
    }
    //obtener el ultimo
    getLastInsertedClinicHistory = () => {
      //enviar al endpoint
      fetch (this.props.parentState.endpoint + 'api/historiaclinica/-1', {
        method: 'GET',
        headers: {
          'access-token' : this.props.parentState.token
        }
      })
      .then(res => res.json())
      .then(jsondata => {
        const { status, message, data } = jsondata;
        if (status === 200) {
          return data;
        }else{
          Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })
        }
      })
      .catch(err => {
        Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
      });
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
    //cambiar el estado en el MODAL para adicionar
    changeModalState = async (evt) => {
      if (evt.target.className.includes('modal-button-add')) {
        this.clearModalState();
        this.setState({ openModal: true });
      }else if(evt.target.className.includes('modal-button-cancel')){
        this.setState({ openModal: false });
      }else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.addClinicHistory()){
            //enviar a recargar los pacientes
            this.props.allClinicsHistory();
            this.clearModalState();
          }
        }
      }
    }
    //limpiar states
    clearModalState = () => {
      const lastinserted = this.getLastInsertedClinicHistory();
      //obtener la fecha
      var fecha = new Date();
      const ano = fecha.getFullYear();
      const mes = fecha.getMonth();
      const dia = fecha.getDate();
      //extraer las partes para el formato de la historia clinica (año mes dia numeroconsecutivo) ej: 205280020
      let numero = ano+mes+dia+'0000';
      if (lastinserted != null) {
        numero = lastinserted.numerohistoria.slice(-4);
      }

      let opcion = [];
      
      this.props.pacientes.forEach(p => {
        //validacion si el paciente tiene una historia no se debe de mostrar
        //en caso de que sea mayor que cero
        if (this.props.historiasclinicas.length > 0) {
          //busco los pacientes que no tengan historias validas
          if (!this.props.historiasclinicas.some(h => h.paciente._id === p._id)) {
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
      //actualizar los states
      this.setState({
        openModal: false,
        areaDeSalud: '', 
        numerohistoria: numero, 
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
                <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.changeModalState} className='modal-button-add'>
                  <Icon name='add circle' /> Adicionar
                </Button>
            }
        >
            <Header icon='clipboard' content='Adicionar  ' />
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
                    name = 'paciente' label = 'Paciente:' placeholder = 'Seleccionar Paciente' options={this.state.opcionPacientes} value={this.state.paciente} onChange = { (e, {value}) => { this.setState({ paciente : value }); } } fluid selection clearable
                />
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                  <Icon name='remove' /> Cancelar
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
  
  export default ComponentAddPatient;