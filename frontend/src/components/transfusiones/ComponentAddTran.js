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
class ComponentAddTran extends Component {
  //#region Properties
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

    this.SetDate = this.SetDate.bind(this);
    this.AddTran = this.AddTran.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.ClearModalState = this.ClearModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }
  //#endregion

  //#region Metodos y Eventos
  //componente se monto
  componentDidMount() {
    this.ClearModalState();
  }
  shouldComponentUpdate() {
    const data = this.props.global.cookies();
    if (!data) {
      this.props.Deslogin();
      return false;
    }
    return true;
  }
  //adicionar nuevo paciente
  AddTran = async () => {
    //chequear que las cookies tengan los datos necesarios
    const data = this.props.global.cookies();
    if (!data) this.props.Deslogin();
    else {
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
        const res = await fetch(this.props.global.endpoint + "api/transfusion/", {
          method: "POST",
          body: JSON.stringify(tran),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "access-token": data.token,
          },
        });
        let serverdata = await res.json();
        //capturar respuesta
        const { status, message } = serverdata;
        if (status === 200) {
          this.ClearModalState();
          Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 3000 });
          return true;
        } else {
          Swal.fire({ position: "center", icon: "error", title: message, showConfirmButton: false, timer: 5000 });
          return false;
        }
      } catch (err) {
        Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 });
        return false;
      }
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
  //al presionar la tecla de ENTER
  OnPressEnter = (evt) => {
    const disabled = !this.state.fecha || !this.state.paciente;
    if (evt.keyCode === 13 && !evt.shiftKey && !disabled) {
      evt.preventDefault();
      this.OnSubmit(evt);
    }
  };
  //al enviar a aplicar el formulario
  OnSubmit = async (evt) => {
    //si no hay problemas en el formulario
    if (this.HandleSubmit(evt) === false) {
      //si no hay problemas en la insercion
      if (await this.AddTran()) {
        //enviar a recargar los pacientes
        this.props.GetDataFromServer();
        this.ClearModalState();
      }
    }
  };
  //cambiar el estado en el MODAL para adicionar
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
      this.ClearModalState();
      this.setState({ openModal: true });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.setState({ openModal: false });
    } else {
      this.OnSubmit(evt);
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

    const paciente = this.props.paciente != null ? this.props.paciente._id : null;
    //actualizar los states
    this.setState({
      openModal: false,
      fecha: "",
      reaccionAdversa: false,
      observaciones: "",
      paciente: paciente,
      opcionPacientes: opcion,
      activo: true,
      errorform: false,
    });
  };
  //capturar fecha
  SetDate = (fecha) => {
    this.setState({ fecha: fecha });
  };
  ChangeIconInAddButton = (change) => {
    const position = this.props.middleButtonAdd ? "middle" : "right";
    if (change)
      return (
        <Button icon floated={position} labelPosition="right" className="modal-button-add" onClick={this.ChangeModalState}>
          <Icon name="add circle" className="modal-icon-add" onClick={this.ChangeModalState} />
          Adicionar
        </Button>
      );
    else
      return (
        <Button icon floated={position} labelPosition="left" primary size="small" onClick={this.ChangeModalState} className="modal-button-add">
          <Icon name="add circle" className="modal-icon-add" />
          Adicionar
        </Button>
      );
  };
  //#endregion

  //#region Render
  render() {
    return (
      <Modal open={this.state.openModal} trigger={this.ChangeIconInAddButton(this.props.cambiarIcono)}>
        <Header icon="tint" content="Adicionar Transfusión" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Group>
              <Segment className="modal-segment-expanded">
                <Header as="h5">Fecha:</Header>
                <ComponentInputDatePicker SetDate={this.SetDate} />
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
              value={this.state.paciente}
              onChange={(e, { value }) => {
                this.setState({ paciente: value });
              }}
              fluid
              selection
              clearable
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
            <Icon name="remove" className="modal-icon-cancel" />
            Cancelar
          </Button>
          <Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.fecha || !this.state.paciente}>
            <Icon name="checkmark" className="modal-icon-accept" />
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
export default ComponentAddTran;
//#endregion
