//#region Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Checkbox } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentAddPatient from "./ComponentAddPatient";
import ComponentUpdatePatient from "./ComponentUpdatePatient";
import ComponentChilds from "./ComponentChilds";
import ComponentSeeClinicHistory from "../historiaclinica/ComponentSeeClinicHistory";
import ComponentModalTran from "../transfusiones/ComponentModalTrans";
import ComponentModalPregnancy from "../embarazo/ComponentModalPregnancy";
//#endregion

//#region Defincion de la clase
class ComponentPatients extends Component {
  constructor(props) {
    super(props);

    this.deletePatient = this.deletePatient.bind(this);
  }

  //eliminar el paciente
  deletePatient = (paciente) => {
    //Esta seguro?
    let { text, accion } = "";
    if (paciente.activo) accion = "Desactivar";
    else accion = "Eliminar";
    text = "Desea " + accion + " el paciente: " + paciente.nombre + " " + paciente.apellidos;

    Swal.fire({
      title: "¿Esta seguro?",
      text: text,
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#db2828",
      confirmButtonColor: "#21ba45",
      confirmButtonText: "Si, " + accion,
      reverseButtons: true,
    }).then((result) => {
      //si escogio Si
      if (result.value) {
        //enviar al endpoint
        fetch(this.props.parentState.endpoint + "api/paciente/" + paciente._id, {
          method: "PUT",
          body: JSON.stringify(paciente),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "access-token": this.props.parentState.token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            const { status, message } = data;
            status === 200
              ? Swal.fire({
                  position: "center",
                  icon: "success",
                  title: message,
                  showConfirmButton: false,
                  timer: 3000,
                })
              : Swal.fire({
                  position: "center",
                  icon: "error",
                  title: message,
                  showConfirmButton: false,
                  timer: 5000,
                });

            this.props.GetDataFromServer();
          })
          .catch((err) => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: err,
              showConfirmButton: false,
              timer: 5000,
            });
          });
      }
    });
  };
  CheckAndAllowAddButton = (middleButtonAdd, allow) => {
    if (allow)
      return (
        <ComponentAddPatient middleButtonAdd={middleButtonAdd} GetDataFromServer={this.props.GetDataFromServer} parentState={this.props.parentState} roles={this.props.roles} />
      );
    else
      return (
        <Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
          <Icon name="add circle" />
          Adicionar
        </Button>
      );
  };

  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find((p) => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find((p) => p.opcion === "pacientes");
    //chequear si es paciente y tengo permiso
    return (
      <Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
        <Grid.Column className="gestionar-allcolumn">
          <Label attached="top left" className="div-label-attached" size="large">
            <Icon name="wheelchair" size="large" inverted /> Gestión de Pacientes
          </Label>
          {this.props.pacientes.length > 0 ? (
            <Table compact celled definition attached="top" className="div-table">
              <Table.Header className="div-table-header-row">
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell colSpan="15">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Fecha Creación</Table.HeaderCell>
                  <Table.HeaderCell>Nombres y Apellidos</Table.HeaderCell>
                  <Table.HeaderCell>Carnet Identidad</Table.HeaderCell>
                  <Table.HeaderCell>Dirección</Table.HeaderCell>
                  <Table.HeaderCell>Teléfonos</Table.HeaderCell>
                  <Table.HeaderCell>Madre</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Género</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Hijos</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Historia Clínica</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Transfusiones</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Embarazos</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Examenes</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.props.pacientes.map((paciente) => {
                  let negative = !paciente.activo;
                  let fechacadena = moment(new Date(paciente.fechaDeCreacion)).format("DD-MM-YYYY");

                  let madre = paciente.madre;
                  let madrenombreyapellido = madre == null ? "Indefinido" : madre.nombre + " " + madre.apellidos;
                  // let rolData = this.props.roles.find(element => { return element.key === usuario.rol });
                  // //para colorear row
                  // let negative = this.props.parentState.usuario === usuario.nombre;
                  return (
                    <Table.Row key={paciente._id} negative={negative}>
                      <Table.Cell collapsing>
                        <Icon name="wheelchair" />
                      </Table.Cell>
                      <Table.Cell>{fechacadena}</Table.Cell>
                      <Table.Cell>
                        {paciente.nombre} {paciente.apellidos}
                      </Table.Cell>
                      <Table.Cell>{paciente.ci}</Table.Cell>
                      <Table.Cell>{paciente.direccion}</Table.Cell>
                      <Table.Cell>{paciente.telefono}</Table.Cell>
                      <Table.Cell>
                        <Button icon labelPosition="right" className="button-childs">
                          <Icon name="venus" className="button-icon-childs" />
                          {madrenombreyapellido}
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        {paciente.sexo === "M" ? (
                          <Button icon labelPosition="right" className="button-childs">
                            <Icon name="man" className="button-icon-childs" />
                            Masculino
                          </Button>
                        ) : (
                          <Button icon labelPosition="right" className="button-childs">
                            <Icon name="woman" className="button-icon-childs" />
                            Femenino
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        {accesomenu.permisos.modificar ? (
                          <ComponentChilds
                            parentState={this.props.parentState}
                            paciente={paciente}
                            pacientes={this.props.pacientes}
                            GetDataFromServer={this.props.GetDataFromServer}
                          />
                        ) : (
                          <Button icon labelPosition="right" className="modal-button-other">
                            <Icon name="child" className="modal-icon-other" />
                            {paciente.hijos !== null ? (paciente.hijos.length > 0 ? paciente.hijos.length : 0) : ""}
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        <ComponentSeeClinicHistory
                          GetDataFromServer={this.props.GetDataFromServer}
                          parentState={this.props.parentState}
                          paciente={paciente}
                          pacientes={this.props.pacientes}
                          historiasclinicas={this.props.historiasclinicas}
                          roles={this.props.roles}
                          permisos={this.props.permisos}
                        />
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        <ComponentModalTran
                          parentState={this.props.parentState}
                          roles={this.props.roles}
                          permisos={this.props.permisos}
                          pacientes={this.props.pacientes}
                          paciente={paciente}
                          transfusiones={paciente.transfusiones}
                          GetDataFromServer={this.props.GetDataFromServer}
                          cambiarIcono={true}
                        />
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        <ComponentModalPregnancy
                          parentState={this.props.parentState}
                          roles={this.props.roles}
                          permisos={this.props.permisos}
                          pacientes={this.props.pacientes}
                          paciente={paciente}
                          embarazos={paciente.embarazos}
                          GetDataFromServer={this.props.GetDataFromServer}
                          cambiarIcono={true}
                        />
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        <Button icon labelPosition="right" className="button-childs">
                          <Icon name="heartbeat" className="button-icon-childs" />0
                        </Button>
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        <Checkbox toggle name="activo" labelPosition="left" label={paciente.activo ? "Si" : "No"} checked={paciente.activo} disabled />
                      </Table.Cell>
                      <Table.Cell className="cells-max-witdh-2" collapsing>
                        {accesomenu.permisos.eliminar ? (
                          <Button icon="remove circle" className="button-remove" onClick={() => this.deletePatient(paciente)} />
                        ) : (
                          <Button icon="remove circle" className="button-remove" disabled />
                        )}
                        {accesomenu.permisos.modificar ? (
                          <ComponentUpdatePatient
                            GetDataFromServer={this.props.GetDataFromServer}
                            paciente={paciente}
                            parentState={this.props.parentState}
                            roles={this.props.roles}
                          />
                        ) : (
                          <Button icon="edit" disabled />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          ) : (
            this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)
          )}
        </Grid.Column>
      </Grid>
    );
  }
}
//#endregion

//#region Exports
export default ComponentPatients;
//#endregion
