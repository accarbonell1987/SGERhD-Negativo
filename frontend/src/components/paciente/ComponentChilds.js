//Importaciones
import React, { Component } from 'react';
import { Button, Icon, Header, Modal, Form, Table, Checkbox } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import '../global/css/Gestionar.css';

class ComponentChilds extends Component {
    state = {
      openModal: false,
      nombre: '',
      apellidos: '',
      hijos: [],
      hijoseliminados: []
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
      this.changeCheckBox = this.changeCheckBox.bind(this);
    }
    //modificar paciente
    updatePatient = async (id) => {
      const { hijos, hijoseliminados } = this.state;

      this.props.paciente.hijos = hijos;
      this.props.paciente.hijoseliminados = hijoseliminados;

      console.log('paciente.updatePatient ->' + this.props.paciente);
      
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.parentState.endpoint + 'api/paciente/' + id, {
            method: 'PATCH',
            body: JSON.stringify(this.props.paciente),
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
    //Actualiza los inputs con los valores que vamos escribiendo
    changeModalInput = (evt) => {
      const { name, value } = evt.target;
  
      this.setState({
        [name] : value
      });
    }
    //cambiar el estado en el MODAL para adicionar usuario
    changeModalState = async (evt) => {
      if (evt.target.className.includes('modal-button-action') || evt.target.className.includes('modal-icon') || evt.target.className.includes('modal-button-other') || evt.target.className.includes('modal-icon-other')) {
        this.setState({
          nombre: this.props.paciente.nombre,
          apellidos: this.props.paciente.apellidos,
          hijos: this.props.paciente.hijos,
          openModal: true,
        });
      }else if(evt.target.className.includes('modal-button-cancel')){
        this.clearModalState();
      }else {
        //si no hay problemas en la insercion
        if (await this.updatePatient(this.props.paciente._id)){
          //enviar a recargar los usuarios
          this.props.allPatients();
          this.clearModalState();
        }
      }
    }
    //limpiar states
    clearModalState = () => {
      this.setState({
        openModal: false,
        nombre: '',
        apellidos: '',
        hijos: [],
        hijoseliminados: []
      });
    }
    //cambiar el CheckBox
    changeCheckBox = (evt, data) => {
      try {
        if (data.checked) {
          this.addChild(data);
        } else {
          this.delChild(data);
        }
      } catch (err) {
        Swal.fire({ position: 'center', icon: 'error', title: err , showConfirmButton: false, timer: 5000 });
      }
    }
    addChild = (data) => {
      if (this.state.hijos === null) {
        this.setState(s => {
          const hijos = [data.name];
          return { hijos: hijos }
        });
      } else {
        this.setState(s => {
          const hijos = [...this.state.hijos, data.name];
          const hijoseliminados = this.state.hijoseliminados.filter( p => p !== data.name );
          return { 
            hijos: hijos,
            hijoseliminados: hijoseliminados
          }
        });
      }
    }
    delChild = (data) => {
      if (this.state.hijos !== null) {
        this.setState(s => {
          const hijos = this.state.hijos.filter( p => p !== data.name );
          const hijoseliminados = [...this.state.hijoseliminados, data.name];
          return { 
            hijos: hijos,
            hijoseliminados: hijoseliminados
          }
        });
      }
    }
  
    render() {
      return (
        <Modal open={this.state.openModal}
            trigger = {
                <Button className='modal-button-other' onClick={this.changeModalState} >
                  <Icon name='child' className='modal-icon-other' onClick={this.changeModalState}/>Hijos {this.props.paciente.hijos !== null ?this.props.paciente.hijos.length > 0 ? this.props.paciente.hijos.length : '' : '' }
                </Button>
            }
        >
          <Header icon='child' content='Seleccionar Hijos  ' />
          <Modal.Content>
          <Form ref='form' onSubmit={this.changeModalState}>
            <Table compact celled definition attached='top' className='div-table-modal'>
              <Table.Header>
              { 
                (this.props.pacientes.length > 0) ? 
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Selección</Table.HeaderCell>
                  <Table.HeaderCell>Nombres y Apellidos</Table.HeaderCell>
                  <Table.HeaderCell>Carnet Identidad</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Género</Table.HeaderCell>
                </Table.Row> : ''
              }
              </Table.Header>
              <Table.Body>
              { this.props.pacientes.map (paciente => 
                {
                  let esHijo = false;
                  //buscar si el tengo que marcar el checkbox
                  if (this.state.hijos !== null) {
                    esHijo = this.state.hijos.includes(paciente._id);
                  }
                  //chequear que el paciente actual sea diferente al que mando la peticion de escoger los hijos
                  if (paciente._id !== this.props.paciente._id) {
                    return(
                      <Table.Row key={paciente._id} >
                        <Table.Cell collapsing>
                          <Icon name='child' />
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox key={paciente._id} name={paciente._id} defaultChecked={esHijo} onChange={(e, data) => { this.changeCheckBox(e, data); } }/>
                        </Table.Cell>
                        <Table.Cell>{paciente.nombre} {paciente.apellidos}</Table.Cell>
                        <Table.Cell>{paciente.ci}</Table.Cell>
                        <Table.Cell>
                        {
                          paciente.sexo === 'M' ? 
                          <Button icon labelPosition='right' className='button-childs'>
                            <Icon name='man' className='button-icon-childs'/>Masculino
                          </Button>  
                          : 
                          <Button icon labelPosition='right' className='button-childs'>
                            <Icon name='woman' className='button-icon-childs'/>Femenino
                          </Button>
                        }
                        </Table.Cell>
                      </Table.Row>
                    )
                  } else return('');
                })
              }
              </Table.Body>
            </Table>
          </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.changeModalState} className='modal-button-cancel' type>
                <Icon name='remove' /> Cancelar
            </Button>
            <Button color='green' onClick={this.changeModalState} className='modal-button-accept' type='submit'>
                <Icon name='checkmark' /> Aceptar
            </Button>
          </Modal.Actions>
        </Modal>
      );
    }
  }
  
  export default ComponentChilds;