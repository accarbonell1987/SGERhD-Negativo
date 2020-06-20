//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentInputDatePicker from "../generales/ComponentInputDatePicker";
//#endregion

//#region Definicion Clase
class ComponentUpdateTran extends Component {
  //#region Estados y Declaraciones
  state = {
    openModal: false,
    fecha: null,
    reaccionAdversa: false,
    observaciones: "",
    paciente: null,
    opcionPacientes: [],
    activo: true,
    errorform: false,
  };
  //#endregion

  //#region Constructor
  constructor(props) {
    super(props);

    this.setDate = this.setDate.bind(this);
    this.updateTran = this.updateTran.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.ClearModalState = this.ClearModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }
  //#endregion

  //#region Metodos y Eventos
  SwalAlert = (posicion, icon, mensaje, tiempo) => {
    Swal.fire({
      position: posicion,
      icon: icon,
      title: mensaje,
      showConfirmButton: false,
      timer: tiempo,
    });
  };

  //componente se monto
  componentDidMount() {
    this.ClearModalState();
  }
  //modificar usuario
  updateTran = async (id) => {
    const { fecha, reaccionAdversa, observaciones, paciente, activo } = this.state;
    const tran = {
      fecha: fecha,
      reaccionAdversa: reaccionAdversa,
      observaciones: observaciones,
      paciente: paciente,
      activo: activo,
    };
    //la promise debe de devolver un valor RETURN
    try {
      const res = await fetch(this.props.global.endpoint + "api/transfusion/" + id, {
        method: "PATCH",
        body: JSON.stringify(tran),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "access-token": this.props.global.token,
        },
      });
      let jsondata = await res.json();
      const { status, message } = jsondata;
      if (status === 200) {
        this.SwalAlert("center", "success", message, 3000);
        return true;
      } else {
        this.SwalAlert("center", "error", message, 5000);
        return false;
      }
    } catch (err) {
      this.SwalAlert("center", "error", err, 5000);
      return false;
    }
  };
  //validar el formulario
  HandleSubmit = (evt) => {
    evt.preventDefault();
    return false;
  };
  //Actualiza los inputs con los valores que vamos escribiendo
  ChangeModalInput = (evt) => {
    const { name, value } = evt.target;

    this.setState({
      [name]: value,
    });
  };
  //cambiar el estado en el MODAL para adicionar
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("modal-button-action") || evt.target.className.includes("modal-icon")) {
      this.ClearModalState();

      let fecha = new Date(this.props.tran.fecha);

      this.setState({
        openModal: true,
        fecha: fecha,
        reaccionAdversa: this.props.tran.reaccionAdversa,
        observaciones: this.props.tran.observaciones,
        paciente: this.props.tran.paciente,
        activo: this.props.tran.activo,
      });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.setState({ openModal: false });
    } else {
      //si no hay problemas en el formulario
      if (this.HandleSubmit(evt) === false) {
        //si no hay problemas en la insercion
        if (await this.updateTran(this.props.tran._id)) {
          //enviar a recargar los pacientes
          this.props.GetDataFromServer();
          this.ClearModalState();
        }
      }
    }
  };
  //limpiar states
  ClearModalState = () => {
    let opcion = [];
    this.props.pacientes.forEach((p) => {
      let nombreyapellidos = p.nombre + " " + p.apellidos;
      let cur = { key: p._id, text: nombreyapellidos, value: p._id, icon: "wheelchair" };
      opcion = [...opcion, cur];
    });

    const pacienteid = this.props.paciente != null ? this.props.paciente._id : "";
    //actualizar los states
    this.setState({
      openModal: false,
      fecha: "",
      reaccionAdversa: false,
      observaciones: "",
      paciente: pacienteid,
      opcionPacientes: opcion,
      activo: true,
      errorform: false,
    });
  };
  //capturar fecha
  setDate = (fecha) => {
    this.setState({ fecha: fecha });
  };
  //#endregion

  //#region Render
  render() {
    return (
      <Modal
        open={this.state.openModal}
        trigger={
          <Button className="modal-button-action" onClick={this.ChangeModalState}>
            <Icon name="edit" className="modal-icon" onClick={this.ChangeModalState} />
          </Button>
        }
      >
        <Header icon="tint" content="Modificar Transfusión" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Group>
              <Segment className="modal-segment-expanded">
                <Header as="h5">Fecha:</Header>
                <ComponentInputDatePicker setDate={this.setDate} fecha={this.state.fecha} />
              </Segment>
            </Form.Group>
            <Form.Group>
              <Segment className="modal-segment-expanded">
                <Header as="h5">Reacción Adversa:</Header>
                <Form.Checkbox
                  toggle
                  name="reaccionAdversa"
                  labelPosition="left"
                  label={this.state.reaccionAdversa === true ? "Si" : "No"}
                  value={this.state.reaccionAdversa}
                  checked={this.state.reaccionAdversa}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      reaccionAdversa: !this.state.reaccionAdversa,
                    });
                  }}
                />
              </Segment>
            </Form.Group>
            <Form.TextArea name="observaciones" label="Observaciones:" placeholder="Observaciones..." value={this.state.observaciones} onChange={this.ChangeModalInput} />
            <Form.Select
              name="paciente"
              label="Paciente:"
              placeholder="Seleccionar Paciente"
              options={this.state.opcionPacientes}
              value={this.state.paciente ? this.state.paciente._id : null}
              onChange={(e, { value }) => {
                this.setState({ paciente: value });
              }}
              fluid
              selection
              clearable
            />
            <Form.Group>
              <Segment className="modal-segment-expanded">
                <Header as="h5">Activo:</Header>
                <Form.Checkbox
                  toggle
                  name="activo"
                  labelPosition="left"
                  label={this.state.activo === true ? "Si" : "No"}
                  value={this.state.activo}
                  checked={this.state.activo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    //solo permito activar y en caso de que este desactivado
                    if (!this.state.activo)
                      this.setState({
                        activo: !this.state.activo,
                      });
                    else {
                      this.SwalAlert("center", "warning", "Solo se permite desactivar desde el bóton de Desactivar/Eliminar", 5000);
                    }
                  }}
                />
              </Segment>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
            <Icon name="remove" className="modal-icon-cancel" />
            Cancelar
          </Button>
          <Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.fecha || !this.state.paciente}>
            <Icon name="checkmark" />
            Aceptar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  //#endregion
}
//#endregion

//#region Exports
export default ComponentUpdateTran;
//#endregion
