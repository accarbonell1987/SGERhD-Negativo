//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentInputDatePicker from "../generales/ComponentInputDatePicker";
//#endregion

//#region Definicion Clase
class ComponentAddPregnancy extends Component {
  //#region Properties
  state = {
    openModal: false,
    fecha: null,
    observaciones: "",
    examenes: [],
    tipo: "Nuevo",
    semanas: 0,
    dias: 0,
    findeembarazo: "Parto", //parto o aborto
    findeparto: "Natural", //natural o cesarea
    findeaborto: "Interrumpido", //natural o interrumpido
    paciente: null,
    activo: true,
    opcionPacientes: [],
    errortiempogestacion: false,
    errorform: false,
  };
  //#endregion

  //#region Constructor
  constructor(props) {
    super(props);

    this.setDate = this.setDate.bind(this);
    this.addPregnancy = this.addPregnancy.bind(this);
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
  //adicionar nuevo paciente
  addPregnancy = async () => {
    let { fecha, observaciones, examenes, tipo, semanas, dias, findeembarazo, findeaborto, findeparto, paciente, activo } = this.state;
    //limpiar segun el tip de embarazo
    if (tipo === "Nuevo") {
      findeembarazo = null;
      findeaborto = null;
      findeparto = null;
    } else {
      semanas = 0;
      dias = 0;
    }

    const pregnancy = {
      fecha: fecha,
      observaciones: observaciones,
      examenes: examenes,
      tipo: tipo,
      semanas: semanas,
      dias: dias,
      findeembarazo: findeembarazo,
      findeaborto: findeaborto,
      findeparto: findeparto,
      paciente: paciente,
      activo: activo,
    };
    //la promise debe de devolver un valor RETURN
    try {
      const res = await fetch(this.props.parentState.endpoint + "api/embarazo/", {
        method: "POST",
        body: JSON.stringify(pregnancy),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "access-token": this.props.parentState.token,
        },
      });
      let data = await res.json();
      //capturar respuesta
      const { status, message } = data;
      if (status === 200) {
        this.ClearModalState();
        Swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 3000,
        });
        return true;
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 5000,
        });
        return false;
      }
    } catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: err,
        showConfirmButton: false,
        timer: 5000,
      });
      return false;
    }
  };
  //validar el formulario
  HandleSubmit = (evt) => {
    evt.preventDefault();

    const errortiempogestacion =
      this.state.tipo === "Nuevo"
        ? !(this.state.semanas > 0 || this.state.dias > 0)
          ? {
              content: "El tiempo de gestación no puede ser cero",
              pointing: "above",
            }
          : false
        : false;

    let etiempogestacion = Boolean(errortiempogestacion);

    let errform = etiempogestacion;

    this.setState({
      errortiempogestacion: errortiempogestacion,
      errorform: errform,
    });

    return errform;
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
    if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
      this.ClearModalState();
      this.setState({ openModal: true });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.setState({ openModal: false });
    } else {
      //si no hay problemas en el formulario
      if (this.HandleSubmit(evt) === false) {
        //si no hay problemas en la insercion
        if (await this.addPregnancy()) {
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
      //solo almaceno los paciente que son hembras
      if (p.sexo === "F") {
        let nombreyapellidos = p.nombre + " " + p.apellidos;
        let cur = {
          key: p._id,
          text: nombreyapellidos,
          value: p._id,
          icon: "wheelchair",
        };
        opcion = [...opcion, cur];
      }
    });

    const paciente = this.props.paciente != null ? this.props.paciente._id : null;
    //actualizar los states
    this.setState({
      openModal: false,
      fecha: null,
      observaciones: "",
      examenes: [],
      tipo: "Nuevo",
      semanas: 0,
      dias: 0,
      findeembarazo: "Parto", //parto o aborto
      findeparto: "Natural", //natural o cesarea
      findeaborto: "Interrumpido", //natural o interrumpido
      activo: true,
      paciente: paciente,
      opcionPacientes: opcion,
      errortiempogestacion: false,
      errorform: false,
    });
  };
  //capturar fecha
  setDate = (fecha) => {
    //calcular el dia de la semana
    const ahora = moment();
    const fechaSeleccionada = moment(fecha);
    const calculardiferenciasemanas = ahora.format("w") - fechaSeleccionada.format("w");

    //diferencias de dias
    let difdias = ahora.diff(fechaSeleccionada, "days");

    let dias = 0;
    let stop = false;
    let diadesemana = 0;
    while (!stop) {
      //si los dias menos siete da resto cero
      diadesemana = difdias - dias;
      if (diadesemana % 7 === 0) stop = true;
      else dias++;
    }

    let semana = calculardiferenciasemanas > 0 ? calculardiferenciasemanas : 0;
    if (ahora.get("date") < diadesemana) semana--;
    this.setState({
      fecha: fecha,
      semanas: semana,
      dias: dias,
    });
  };
  changeIconInAddButton = (change) => {
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
  choseEndOfPregnancy = () => {
    if (this.state.findeembarazo === "Parto") {
      return (
        <Form.Group inline>
          <Form.Radio
            name="radiopartonatural"
            labelPosition="right"
            label="Natural"
            checked={this.state.findeparto === "Natural"}
            value={this.state.findeparto}
            onChange={(evt) => {
              evt.preventDefault();
              this.setState({
                findeparto: "Natural",
              });
            }}
          />
          <Form.Radio
            name="radiopartocesarea"
            labelPosition="right"
            label="Cesarea"
            checked={this.state.findeparto === "Cesarea"}
            value={this.state.findeparto}
            onChange={(evt) => {
              evt.preventDefault();
              this.setState({
                findeparto: "cesarea",
              });
            }}
          />
        </Form.Group>
      );
    } else if (this.state.findeembarazo === "Aborto") {
      return (
        <Form.Group inline>
          <Form.Radio
            name="radioabortonatural"
            labelPosition="right"
            label="Natural"
            checked={this.state.findeaborto === "Natural"}
            value={this.state.findeaborto}
            onChange={(evt) => {
              evt.preventDefault();
              this.setState({
                findeaborto: "Natural",
              });
            }}
          />
          <Form.Radio
            name="radioabortointerrumpido"
            labelPosition="right"
            label="Interrumpido"
            checked={this.state.findeaborto === "Interrumpido"}
            value={this.state.findeaborto}
            onChange={(evt) => {
              evt.preventDefault();
              this.setState({
                findeaborto: "Interrumpido",
              });
            }}
          />
        </Form.Group>
      );
    }
  };
  choseType = () => {
    if (this.state.tipo === "Nuevo") {
      return (
        <Segment.Group className="segmentgroup-correct">
          <Segment as="h5">Tiempo de Gestación:</Segment>
          <Segment.Group horizontal>
            <Segment>
              <Form.Group>
                <Form.Input
                  className="modal-input-100p"
                  required
                  name="semanas"
                  icon="calendar alternate outline"
                  iconPosition="left"
                  label="Semanas:"
                  value={this.state.semanas}
                  error={this.state.errortiempogestacion}
                />
                <Button.Group>
                  <Button
                    className="button-group-addsub"
                    icon="plus"
                    primary
                    onClick={(evt) => {
                      evt.preventDefault();
                      this.setState({
                        semanas: this.state.semanas + 1,
                      });
                    }}
                  />
                  <Button
                    className="button-group-addsub"
                    icon="minus"
                    secondary
                    disabled={this.state.semanas === 0}
                    onClick={(evt) => {
                      evt.preventDefault();
                      this.setState({
                        semanas: this.state.semanas - 1,
                      });
                    }}
                  />
                </Button.Group>
              </Form.Group>
            </Segment>
            <Segment>
              <Form.Group>
                <Form.Input
                  className="modal-input-100p"
                  required
                  name="dias"
                  icon="calendar alternate"
                  iconPosition="left"
                  label="Dias:"
                  value={this.state.dias}
                  error={this.state.errortiempogestacion}
                />
                <Button.Group>
                  <Button
                    className="button-group-addsub"
                    icon="plus"
                    primary
                    onClick={(evt) => {
                      evt.preventDefault();
                      this.setState({
                        dias: this.state.dias + 1,
                      });
                    }}
                  />
                  <Button
                    className="button-group-addsub"
                    icon="minus"
                    secondary
                    disabled={this.state.dias === 0}
                    onClick={(evt) => {
                      evt.preventDefault();
                      this.setState({
                        dias: this.state.dias - 1,
                      });
                    }}
                  />
                </Button.Group>
              </Form.Group>
            </Segment>
          </Segment.Group>
        </Segment.Group>
      );
    } else {
      return (
        <Segment.Group className="segmentgroup-correct">
          <Segment.Group horizontal>
            <Segment className="modal-segment-expanded-grouping">
              <Form.Group inline>
                <Header as="h5" className="header-custom">
                  Fin de Embarazo:
                </Header>
                <Form.Radio
                  name="radioparto"
                  labelPosition="right"
                  label="Parto"
                  checked={this.state.findeembarazo === "Parto"}
                  value={this.state.findeembarazo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      findeembarazo: "Parto",
                    });
                  }}
                />
                <Form.Radio
                  name="radioaborto"
                  labelPosition="right"
                  label="Aborto"
                  checked={this.state.findeembarazo === "Aborto"}
                  value={this.state.findeembarazo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      findeembarazo: "Aborto",
                    });
                  }}
                />
              </Form.Group>
              <Segment>{this.choseEndOfPregnancy()}</Segment>
            </Segment>
          </Segment.Group>
        </Segment.Group>
      );
    }
  };
  //#endregion

  //#region Render
  render() {
    return (
      <Modal open={this.state.openModal} trigger={this.changeIconInAddButton(this.props.cambiarIcono)}>
        <Header icon="heartbeat" content="Adicionar Embarazo" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Group>
              <Segment className="modal-segment-expanded">
                <Header as="h5">Fecha de Concepción:</Header>
                <ComponentInputDatePicker setDate={this.setDate} />
              </Segment>
            </Form.Group>
            <Form.TextArea name="observaciones" label="Observaciones:" placeholder="Observaciones..." value={this.state.observaciones} onChange={this.ChangeModalInput} />
            <Segment className="modal-segment-expanded-grouping">
              <Form.Group inline>
                <Header as="h5" className="header-custom">
                  Tipo de Embarazo:
                </Header>
                <Form.Radio
                  name="radionuevo"
                  labelPosition="right"
                  label="Nuevo"
                  checked={this.state.tipo === "Nuevo"}
                  value={this.state.tipo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      tipo: "Nuevo",
                    });
                  }}
                />
                <Form.Radio
                  name="radioantiguo"
                  labelPosition="right"
                  label="Antiguo"
                  checked={this.state.tipo === "Antiguo"}
                  value={this.state.tipo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      tipo: "Antiguo",
                      semanas: 0,
                      dias: 0,
                    });
                  }}
                />
              </Form.Group>
            </Segment>
            <Form.Group>{this.choseType()}</Form.Group>
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
export default ComponentAddPregnancy;
//#endregion
