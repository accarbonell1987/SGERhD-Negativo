//#region Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'
import DateRangePicker from 'react-daterange-picker';
import Moment from 'moment';
import {extendedMoment} from 'moment-range';

import Swal from 'sweetalert2'
//#endregion

//#region CSS
import '../global/css/Gestionar.css';
//#endregion

const moment = extendedMoment(Moment);

//#region Definicion Clase
class ComponentAddTran extends Component {
    //#region Properties
    state = {
      openModal: false,
      fecha: '',
      reaccionAdversa: false,
      observaciones: '',
      paciente: '',
      opcionPacientes: [],
      activo: true,
      errorform: false
    }
    //#endregion

    //#region Constructor
    constructor(props) {
      super(props);
  
      this.addTran = this.addTran.bind(this);
      this.changeModalInput = this.changeModalInput.bind(this);
      this.changeModalState = this.changeModalState.bind(this);
      this.clearModalState = this.clearModalState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    //#endregion
    
    //#region Metodos y Eventos
    //componente se monto
    componentDidMount() {
        this.clearModalState();
    }
    //adicionar nuevo paciente
    addTran = async () => {
      const { fecha, reaccionAdversa, observaciones, paciente, activo } = this.state;
      const tran = {
        fecha: fecha, reaccionAdversa: reaccionAdversa, observaciones: observaciones, paciente: paciente,activo: activo
      }
      //la promise debe de devolver un valor RETURN
      try {
            const res = await fetch(this.props.parentState.endpoint + 'api/transfusion/', {
                method: 'POST',
                body: JSON.stringify(tran),
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
    //validar el formulario
    handleSubmit = (evt) => {
      evt.preventDefault();
      
      this.setState({ 
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
      if ((evt.target.className.includes('modal-button-add')) || (evt.target.className.includes('modal-icon-add')) ||
      (evt.target.className.includes('button-childs')) || (evt.target.className.includes('button-icon-childs'))) {
        this.clearModalState();
        this.setState({ openModal: true });
      }else if ((evt.target.className.includes('modal-button-cancel')) || (evt.target.className.includes('modal-icon-cancel'))){
        this.setState({ openModal: false });
      }else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.addTran()){
            //enviar a recargar los pacientes
            this.props.allPatients();
            this.clearModalState();
          }
        }
      }
    }
    //limpiar states
    clearModalState = () => {
      let opcion = [];
      this.props.pacientes.forEach(p => {
        let nombreyapellidos = p.nombre + ' ' + p.apellidos;
        let cur = { key: p._id, text: nombreyapellidos, value: p._id, icon: 'wheelchair' };
        opcion = [...opcion, cur];
      });

      const pacienteid = this.props.paciente != null ? this.props.paciente._id : '';
      //actualizar los states
      this.setState({
        openModal: false,
        fecha: '',
        reaccionAdversa: false,
        observaciones: '',
        paciente: pacienteid,
        opcionPacientes: opcion,
        activo: true,
        errorform: false
      });
    }
    //#endregion
  
    //#region Render
    render() {
      const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
      //buscar el acceso del menu
      const accesomenu = permiso.accesos.find(p => p.opcion === 'transfusiones');
      //chequear si es historiasclinica y tengo permiso
      return (
        <Modal open={this.state.openModal}
            trigger = {
              accesomenu.permisos.crear ?
                this.props.cambiarIcono ? 
                <Button icon labelPosition='right' className='button-childs' onClick={this.changeModalState} >
                  <Icon name='add circle' className='button-icon-childs' onClick={this.changeModalState}/>Adicionar
                </Button>
                :
                <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.changeModalState} className='modal-button-add'>
                  <Icon name='add circle' className='modal-icon-add'/>Adicionar
                </Button>
              :
                this.props.cambiarIcono ? 
                <Button disabled icon labelPosition='right' className='button-childs'>
                  <Icon name='add circle' className='button-icon-childs'/>Adicionar
                </Button>
                :
                <Button disabled floated='right' icon labelPosition='left' primary size='small'className='modal-button-add'>
                  <Icon name='add circle' className='modal-icon-add'/>Adicionar
                </Button>
            }
        >
            <Header icon='tint' content='Adicionar  ' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
                <DateRangePicker firstOfWeek={1} numberOfCalendars={2} selectionType='range' minimumDate={new Date()} defaultState='available' showLegend={true} value={this.state.fecha} onSelect={this.changeModalInput} />
                {/* <Form.Input
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
                </Segment.Group> */}
                <Form.Select
                    name = 'paciente' label = 'Paciente:' placeholder = 'Seleccionar Paciente' options={this.state.opcionPacientes} value={this.state.paciente} onChange = { (e, {value}) => { this.setState({ paciente : value }); } } fluid selection clearable
                />
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                  <Icon name='remove' className='modal-icon-cancel' />Cancelar
              </Button>
              <Button color='green' onClick={this.changeModalState} className='modal-button-accept' type='submit' disabled={
                  (!this.state.numerohistoria || !this.state.areaDeSalud || !this.state.paciente)
              }>
                  <Icon name='checkmark' />Aceptar
              </Button>
            </Modal.Actions>
        </Modal>
      );
    }
    //#endregion
  }
  
  //#region Exports
  export default ComponentAddTran;
  //#endregion