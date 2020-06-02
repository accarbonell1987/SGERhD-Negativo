//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Message } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentUpdatePatient extends Component {
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
    //modificar paciente
    updateClinicHistory = async (id) => {
      const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, historiaclinica, madre, hijos, transfusiones, embarazos, examenes, activo } = this.state;
      const paciente = {
        nombre: nombre,
        apellidos: apellidos,
        ci: ci,
        direccion: direccion,
        direccionopcional: direccionopcional,
        telefono: telefono,
        sexo: sexo,
        historiaclinica: historiaclinica,
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
        if (status === 'OK') {
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
      let opcion = [];
      
      this.props.pacientes.forEach(p => {
        //validacion si el paciente tiene una historia no se debe de mostrar
        //en caso de que sea mayor que cero
        if (this.props.historiasclinica.length > 0) {
          //busco los pacientes que no tengan historias validas
          if (this.props.historiasclinica.find(history => history === p.historiaclinica)) {
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