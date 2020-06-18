//#region Importaciones
import React, { Component } from "react";
import { Button, Modal, Icon, Header } from "semantic-ui-react";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentPregnancies from "./ComponentPregnancies";
//#endregion

//#region Defincion de la clase
class ComponentModalPregnancy extends Component {
  state = {
    openModal: false,
  };

  componentDidMount = () => {
    this.clearModalState();
  };

  //#region Metodos y Eventos
  changeModalState = async (evt, allow) => {
    if (allow) {
      if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
        this.clearModalState();
        this.setState({ openModal: true });
      } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
        this.setState({ openModal: false });
      }
    }
  };
  clearModalState = () => {
    this.setState({ openModal: false });
  };
  changeIconInAddButton = (allow, change) => {
    const position = this.props.middleButtonAdd ? "middle" : "right";
    const cantEmbarazos = this.props.embarazos ? this.props.embarazos.length : 0;
    const permitir = allow && this.props.paciente.sexo === "F";
    console.log(this.props.paciente, permitir);
    if (change)
      return (
        <Button
          disabled={!permitir}
          icon
          floated={position}
          labelPosition="right"
          className="modal-button-add"
          primary
          onClick={(evt) => {
            this.changeModalState(evt, permitir);
          }}
        >
          <Icon
            name="tint"
            className="modal-icon-add"
            onClick={(evt) => {
              this.changeModalState(evt, permitir);
            }}
          />
          {cantEmbarazos}
        </Button>
      );
    else
      return (
        <Button
          disabled={!permitir}
          floated="right"
          icon
          labelPosition="left"
          primary
          size="small"
          onClick={(evt) => {
            this.changeModalState(evt, permitir);
          }}
          className="modal-button-add"
        >
          <Icon
            name="tint"
            className="modal-icon-add"
            onClick={(evt) => {
              this.changeModalState(evt, permitir);
            }}
          />
          {cantEmbarazos}
        </Button>
      );
  };
  //#endregion

  //#region Render
  render() {
    //buscar el permiso del rol
    const permiso = this.props.permisos.find((p) => p.rol === this.props.parentState.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find((p) => p.opcion === "embarazos");
    const headerlabel = "Listado de Embarazos De: " + this.props.paciente.nombre + " " + this.props.paciente.apellidos;
    //chequear si es embarazos y tengo permiso
    return (
      <Modal className="modal-windows-pregnancies" open={this.state.openModal} trigger={this.changeIconInAddButton(accesomenu.permisos.menu, this.props.cambiarIcono)}>
        <Header icon="heartbeat" content={headerlabel} />
        <Modal.Content>
          <ComponentPregnancies
            middleButtonAdd={true}
            parentState={this.props.parentState}
            roles={this.props.roles}
            permisos={this.props.permisos}
            pacientes={this.props.pacientes}
            embarazos={this.props.embarazos}
            reloadFromServer={this.props.reloadFromServer}
            detail={true}
            paciente={this.props.paciente}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.changeModalState} className="modal-button-cancel" type>
            <Icon name="remove" className="modal-icon-cancel" />
            Cerrar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  //#endregion
}
//#endregion

//#region Export
export default ComponentModalPregnancy;
//#endregion
