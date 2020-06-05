//#region Importaciones
import React, { Component } from 'react';
import { Button, Grid, Icon, Label, Table, Checkbox } from 'semantic-ui-react'
import Swal from 'sweetalert2'
//#endregion

//#region CSS
import '../global/css/Gestionar.css';
//#endregion

//#region Componentes
import ComponentAddTran from './ComponentAddTran';
import ComponentUpdateTran from './ComponentUpdateTran';
import ComponentSeePatient from '../paciente/ComponentSeePatient';
//#endregion

//#region Defincion de la clase
class ComponentTrans extends Component {
  //#region Constructor
  constructor(props) {
    super(props);

    this.deleteTran = this.deleteTran.bind(this);
  }
  //#endregion

  //#region Metodos y Eventos
  deleteTran = (id, paciente) => {
    //Esta seguro?
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Desea eliminar la transfusion perteneciente al paciente: " + paciente.nombre + " " + paciente.apellidos,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#db2828',
      confirmButtonColor: '#21ba45',
      confirmButtonText: 'Si, Eliminar',
      reverseButtons: true
    })
    .then((result) => {
      //si escogio Si
      if (result.value) {
        //enviar al endpoint
        fetch (this.props.parentState.endpoint + 'api/transfusion/' + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'access-token': this.props.parentState.token
          }
        })
        .then(res => res.json())
        .then(data => {
          const { status, message } = data;
          //chequear el mensaje
          status === 200 ?
            Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 3000 })
          :
            Swal.fire({ position: 'center', icon: 'error', title: message, showConfirmButton: false, timer: 5000 })
          
          //recargar
          this.props.allTrans();
          this.props.allPatients();
        })
        .catch(err => {
          Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
        });
      }
    })
  }
  //#endregion

  //#region Render
  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find(p => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find(p => p.opcion === 'transfusiones');
    //chequear si es transfusiones y tengo permiso
    return (
      <Grid textAlign='center' verticalAlign='top' className='gestionar-allgrid'>
        <Grid.Column className='gestionar-allcolumn'>
          <Label attached='top left' className='div-label-attached' size='large'>
            <Icon name='tint' size='large' inverted/> Gestión de Transfusiones
          </Label>
          <Table compact celled definition attached='top' className='div-table'>
            <Table.Header className='div-table-header'>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='6'>
                  { accesomenu.permisos.crear ?
                    <ComponentAddTran parentState = {this.props.parentState} roles = {this.props.roles} pacientes = {this.props.pacientes} permisos = {this.props.permisos} allTrans = {this.props.allTrans} allPatients={this.props.allPatients} />:
                    <Button floated='right' icon labelPosition='left' primary size='small' className='modal-button-add' disabled>
                      <Icon name='add circle' />Adicionar
                    </Button>
                  }
                </Table.HeaderCell>
              </Table.Row>
              { 
                (this.props.transfusiones.length > 0) ? 
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Fecha</Table.HeaderCell>
                  <Table.HeaderCell>Reacción Adversa</Table.HeaderCell>
                  <Table.HeaderCell>Observaciones</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Paciente</Table.HeaderCell>
                  <Table.HeaderCell className='cells-max-witdh-2'>Acciones</Table.HeaderCell>
                </Table.Row> : ''
              }
            </Table.Header>

            <Table.Body>
              { 
                this.props.transfusiones.map(tran => {
                  let fecha = new Date(tran.fecha);
                  let dia = fecha.getDate(); let mes = fecha.getMonth() + 1; let ano = fecha.getFullYear();
                  let fechacadena = dia + '/' + mes + '/' + ano;

                  // let rolData = this.props.roles.find(element => { return element.key === usuario.rol });
                  // //para colorear row
                  // let negative = this.props.parentState.usuario === usuario.nombre;
                  return(
                    <Table.Row key={tran._id} >
                      <Table.Cell collapsing>
                        <Icon name='tint' />
                      </Table.Cell>
                      <Table.Cell>{fechacadena}</Table.Cell>
                      <Table.Cell>
                        <Checkbox
                          toggle name='reaccionAdversa' labelPosition='left' label = {tran.reaccionAdversa ? 'Si' : 'No'} disabled
                        />
                      </Table.Cell>
                      <Table.Cell>{tran.observaciones}</Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        <ComponentSeePatient paciente = {tran.paciente} parentState = {this.props.parentState} roles = {this.props.roles} />
                      </Table.Cell>
                      <Table.Cell className='cells-max-witdh-2' collapsing>
                        {
                          accesomenu.permisos.eliminar ?
                          <Button icon='remove circle' className = 'button-remove' onClick={() => this.deleteTran(tran._id, tran.paciente) } /> : <Button icon='remove circle' className = 'button-remove' disabled />
                        }
                        {
                          accesomenu.permisos.modificar ?
                          <ComponentUpdateTran allPatients = { this.props.allPatients } parentState = {this.props.parentState} roles = {this.props.roles} pacientes = {this.props.pacientes} tran={tran} /> :
                          <Button icon='edit' disabled />
                        }
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    );
  }
  //#endregion
}

//#region Export
export default ComponentTrans;
//#endregion