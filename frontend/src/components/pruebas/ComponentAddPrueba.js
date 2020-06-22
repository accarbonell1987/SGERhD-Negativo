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
class ComponentAddPruebas extends Component {
  //#region Properties
  state = {
    openModal: false,
    fecha: null,
    tipo: "Grupos Sanguineo",
    examen: null,
    grupoSanguineo: null,
    identificacionAnticuerpo: null,
    pesquizajeAnticuerpo: null,
    pendiente: true,
    activo: true,
    opcionExamenes: [],
    errorform: false,
  };
  //#endregion

  //#region Constructor
  constructor(props) {
    super(props);

    this.SetDate = this.SetDate.bind(this);
    this.AddPrueba = this.AddPrueba.bind(this);
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
  AddPrueba = async () => {
    //chequear que las cookies tengan los datos necesarios
    const data = this.props.global.cookies();
    if (!data) this.props.Deslogin();
    else {
      let { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, activo } = this.state;
      const prueba = {
        fecha: fecha,
        tipo: tipo,
        examen: examen,
        grupoSanguineo: grupoSanguineo,
        identificacionAnticuerpo: identificacionAnticuerpo,
        pesquizajeAnticuerpo: pesquizajeAnticuerpo,
        pendiente: pendiente,
        activo: activo,
      };
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.global.endpoint + "api/prueba/", {
          method: "POST",
          body: JSON.stringify(prueba),
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
      if (await this.AddPrueba()) {
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
    this.props.examenes.forEach((e) => {
      let fechacadena = moment(new Date(e.fecha)).format("DD-MM-YYYY");
      let datos = fechacadena + " - " + e.tipo;
      let cur = {
        key: e._id,
        text: datos,
        value: e._id,
        icon: "tint",
      };
      opcion = [...opcion, cur];
    });

    const examen = this.props.examen != null ? this.props.examen._id : null;
    //actualizar los states
    this.setState({
      openModal: false,
      fecha: null,
      tipo: "Grupos Sanguineo",
      examen: examen,
      grupoSanguineo: null,
      identificacionAnticuerpo: null,
      pesquizajeAnticuerpo: null,
      pendiente: true,
      activo: true,
      opcionExamenes: opcion,
      errorform: false,
    });
  };
  //capturar fecha
  SetDate = (fecha) => {
    this.setState({
      fecha: fecha,
    });
  };
  ChangeIconInAddButton = (change) => {
    const position = this.props.middleButtonAdd ? "middle" : "right";
    console.log(position);
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
  ChoseEndOfPregnancy = () => {
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
  ChoseType = () => {
    if (this.state.tipo === "Grupos Sanguineo") {
      return (
        <Segment.Group className="segmentgroup-correct">
          <Segment as="h5">Grupo Sanguineo:</Segment>
          <Segment.Group>
            <Segment></Segment>
            <Segment></Segment>
          </Segment.Group>
        </Segment.Group>
      );
    } else if (this.state.tipo === "Identificación Anticuerpo") {
      return (
        <Segment.Group className="segmentgroup-correct">
          <Segment as="h5">Identificación Anticuerpo:</Segment>
          <Segment.Group>
            <Segment></Segment>
            <Segment></Segment>
          </Segment.Group>
        </Segment.Group>
      );
    } else if (this.state.tipo === "Pesquizaje Anticuerpo") {
      return (
        <Segment.Group className="segmentgroup-correct">
          <Segment as="h5">Pesquizaje Anticuerpo:</Segment>
          <Segment.Group>
            <Segment></Segment>
            <Segment></Segment>
          </Segment.Group>
        </Segment.Group>
      );
    }
  };
  //#endregion

  //#region Render
  render() {
    return (
      <Modal open={this.state.openModal} trigger={this.ChangeIconInAddButton(this.props.cambiarIcono)}>
        <Header icon="heartbeat" content="Adicionar Embarazo" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Group>
              <Segment className="modal-segment-expanded">
                <Header as="h5">Fecha:</Header>
                <ComponentInputDatePicker SetDate={this.SetDate} restringir={false} />
              </Segment>
            </Form.Group>
            <Segment className="modal-segment-expanded-grouping">
              <Form.Group inline>
                <Header as="h5" className="header-custom">
                  Tipo de Prueba:
                </Header>
                <Form.Radio
                  name="radiogruposanguineo"
                  labelPosition="right"
                  label="Grupos Sanguineo"
                  checked={this.state.tipo === "Grupos Sanguineo"}
                  value={this.state.tipo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      tipo: "Grupos Sanguineo",
                    });
                  }}
                />
                <Form.Radio
                  name="radioidentificacionanticuerpo"
                  labelPosition="right"
                  label="Identificación Anticuerpo"
                  checked={this.state.tipo === "Identificación Anticuerpo"}
                  value={this.state.tipo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      tipo: "Identificación Anticuerpo",
                      semanas: 0,
                      dias: 0,
                    });
                  }}
                />
                <Form.Radio
                  name="radiopesquizajeanticuerpo"
                  labelPosition="right"
                  label="Pesquizaje Anticuerpo"
                  checked={this.state.tipo === "Pesquizaje Anticuerpo"}
                  value={this.state.tipo}
                  onChange={(evt) => {
                    evt.preventDefault();
                    this.setState({
                      tipo: "Pesquizaje Anticuerpo",
                      semanas: 0,
                      dias: 0,
                    });
                  }}
                />
              </Form.Group>
            </Segment>
            <Form.Group>{this.ChoseType()}</Form.Group>
            <Form.Select
              name="examen"
              label="Examen:"
              placeholder="Seleccionar Examen"
              options={this.state.opcionExamenes}
              value={this.state.examen}
              onChange={(e, { value }) => {
                this.setState({ examen: value });
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
export default ComponentAddPruebas;
//#endregion
