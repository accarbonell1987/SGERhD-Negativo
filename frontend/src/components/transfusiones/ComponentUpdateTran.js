//#region Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message, Segment } from 'semantic-ui-react'
import Swal from 'sweetalert2'
//#endregion

//#region CSS
import '../global/css/Gestionar.css';
//#endregion

//#region Componentes
import ComponentInputDatePicker from '../generales/ComponentInputDatePicker';
//#endregion

//#region Definicion Clase
class ComponentAddTran extends Component {
    //#region Properties
    state = {
      openModal: false,
      fecha: null,
      reaccionAdversa: false,
      observaciones: '',
      paciente: null,
      opcionPacientes: [],
      activo: true,
      errorform: false
    }
    //#endregion

    //#region Constructor
    constructor(props) {
      super(props);
  
      this.setDate = this.setDate.bind(this);
      this.updateTran = this.updateTran.bind(this);
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
    //modificar usuario
    updateTran = async (id) => {
      const { fecha, reaccionAdversa, observaciones, paciente, activo } = this.state;
      const tran = {
        fecha: fecha, reaccionAdversa: reaccionAdversa, observaciones: observaciones, paciente: paciente, activo: activo
      }
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.parentState.endpoint + 'api/transfusion/' + id, {
            method: 'PATCH',
            body: JSON.stringify(tran),
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
        this.setState({
          openModal: true,
          fecha: this.props.tran.fecha,
          reaccionAdversa: this.props.tran.reaccionAdversa,
          observaciones: this.props.tran.observaciones,
          paciente: this.props.tran.paciente,
          activo: this.props.tran.activo
        });
      }else if ((evt.target.className.includes('modal-button-cancel')) || (evt.target.className.includes('modal-icon-cancel'))){
        this.setState({ openModal: false });
      }else {
        //si no hay problemas en el formulario
        if (this.handleSubmit(evt) === false) {
          //si no hay problemas en la insercion
          if (await this.updateTran(this.props.tran._id)){
            //enviar a recargar los pacientes
            this.props.allTrans();
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
    //capturar fecha
    setDate = (fecha) => {
      this.setState({fecha: fecha});
      console.log(fecha);
    }
    //#endregion
  
    //#region Render
    render() {
      return (
        <Modal open={this.state.openModal}
            trigger = {
                <Button className='modal-button-action' onClick={this.changeModalState} >
                  <Icon name='edit' className='modal-icon' onClick={this.changeModalState}/>
                </Button>
            }
        >
            <Header icon='tint' content='Modificar Transfusión' />
            <Modal.Content>
            { this.state.errorform ? <Message error inverted header='Error' content='Error en el formulario' /> : null } 
            <Form ref='form' onSubmit={this.changeModalState}>
              <Form.Group>
                <Segment className='modal-segment-expanded'>
                  <Header as='h5'>Fecha:</Header>
                  <ComponentInputDatePicker setDate={this.setDate} fecha={this.state.fecha}/>
                </Segment>
              </Form.Group>
              <Form.Group>
                <Segment className='modal-segment-expanded'>
                  <Header as='h5'>Reacción Adversa:</Header>
                  <Form.Checkbox
                    toggle name='reaccionAdversa' labelPosition='left' label = {this.state.reaccionAdversa === true ? 'Si' : 'No'} value={this.state.reaccionAdversa} checked={this.state.reaccionAdversa} onChange = {(evt) => {
                      evt.preventDefault();
                      this.setState({
                        reaccionAdversa: !this.state.reaccionAdversa
                      });
                  }}
                  />
                </Segment>
              </Form.Group>
              <Form.TextArea
                name = 'observaciones' label = 'Observaciones:' placeholder='Observaciones...' value={this.state.observaciones}
              />
              <Form.Select
                  name = 'paciente' label = 'Paciente:' placeholder = 'Seleccionar Paciente' options={this.state.opcionPacientes} value={this.state.paciente ? this.state.paciente._id : null} onChange = { (e, {value}) => { this.setState({ paciente : value }); } } fluid selection clearable
              />
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                  <Icon name='remove' className='modal-icon-cancel' />Cancelar
              </Button>
              <Button color='green' onClick={this.changeModalState} className='modal-button-accept' type='submit' disabled={
                  (!this.state.fecha || !this.state.paciente)
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