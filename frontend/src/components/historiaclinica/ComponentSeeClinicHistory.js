//Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Segment } from "semantic-ui-react";

//CSS
import "../global/css/Gestionar.css";

//Componentes
import ComponentAddClinicHistory from "./ComponentAddClinicHistory";

class ComponentSeeClinicHistory extends Component {
  state = {
    openModal: false,
    opcionPacientes: [],
  };

  generos = [
    { key: "M", text: "Masculino", value: "M", icon: "man" },
    { key: "F", text: "Femenino", value: "F", icon: "woman" },
  ];

  //constructor
  constructor(props) {
    super(props);

    this.ClearModalState = this.ClearModalState.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }

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
  //cambiar el estado en el MODAL para adicionar usuario
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("button-childs") || evt.target.className.includes("button-icon-childs")) {
      this.ClearModalState();
      this.setState({
        openModal: true,
      });
    } else if (evt.target.className.includes("modal-button-cancel")) {
      this.ClearModalState();
    } else {
      this.ClearModalState();
    }
  };
  //limpiar states
  ClearModalState = () => {
    let opcion = [];

    let nombreyapellidos = this.props.paciente.nombre + " " + this.props.paciente.apellidos;
    let cur = {
      key: this.props.paciente._id,
      text: nombreyapellidos,
      value: this.props.paciente._id,
      icon: "wheelchair",
    };
    opcion = [...opcion, cur];

    this.setState({
      openModal: false,
      opcionPacientes: opcion,
    });
  };

  render() {
    const historia = this.props.paciente.historiaclinica;
    //buscar el permiso del rol
    if (historia != null) {
      let classNameToButton = !historia.activo ? "button-childs button-disable" : "button-childs";
      return (
        <Modal
          open={this.state.openModal}
          trigger={
            <Button icon labelPosition="right" className={classNameToButton} onClick={this.ChangeModalState}>
              <Icon name="eye" className="button-icon-childs" onClick={this.ChangeModalState} />
              {historia.numerohistoria}
            </Button>
          }
        >
          <Header icon="clipboard" content="Detalles Historia Clinica" />
          <Modal.Content>
            <Form ref="form">
              <Form.Input name="numerohistoria" icon="address card outline" iconPosition="left" label="Numero de Historia:" value={historia.numerohistoria} />
              <Segment.Group horizontal className="modal-segment-group">
                <Segment className="modal-segment-longleft">
                  <Form.Input
                    name="areaDeSalud"
                    icon="hospital symbol"
                    iconPosition="left"
                    label="Area de Salud:"
                    value={historia.areaDeSalud}
                    placeholder="Consultorio, Policlinico, Hospital"
                  />
                </Segment>
                <Segment className="modal-segment-shortright">
                  <Form.Group>
                    <Segment className="modal-segment-expanded">
                      <Header as="h5">Vacuna Anti-D:</Header>
                      <Form.Checkbox toggle name="vacunaAntiD" labelPosition="left" label={historia.vacunaAntiD === true ? "Si" : "No"} value={historia.vacunaAntiD} readOnly />
                    </Segment>
                  </Form.Group>
                </Segment>
              </Segment.Group>
              <Segment.Group horizontal>
                <Segment>
                  <Form.Group>
                    <Form.Input
                      className="modal-input-100p"
                      name="numeroDeEmbarazos"
                      icon="user md"
                      iconPosition="left"
                      label="Numero de Embarazos:"
                      value={historia.numeroDeEmbarazos}
                    />
                  </Form.Group>
                </Segment>
                <Segment>
                  <Form.Group>
                    <Form.Input className="modal-input-100p" name="numeroDePartos" icon="user md" iconPosition="left" label="Numero de Partos:" value={historia.numeroDePartos} />
                  </Form.Group>
                </Segment>
                <Segment>
                  <Form.Group>
                    <Form.Input
                      className="modal-input-100p"
                      name="numeroDeAbortos"
                      icon="user md"
                      iconPosition="left"
                      label="Numero de Abortos:"
                      value={historia.numeroDeAbortos}
                    />
                  </Form.Group>
                </Segment>
              </Segment.Group>
              <Form.Select
                name="paciente"
                label="Paciente:"
                placeholder="Seleccionar Paciente"
                options={this.state.opcionPacientes}
                value={this.props.paciente._id}
                fluid
                selection
              />
              <Form.Group>
                <Segment className="modal-segment-expanded">
                  <Header as="h5">Activo:</Header>
                  <Form.Checkbox toggle name="activo" labelPosition="left" label={historia.activo === true ? "Si" : "No"} value={historia.activo} checked={historia.activo} />
                </Segment>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
              <Icon name="remove" /> Cancelar
            </Button>
          </Modal.Actions>
        </Modal>
      );
    } else
      return (
        <ComponentAddClinicHistory
          GetDataFromServer={this.props.GetDataFromServer}
          parentState={this.props.parentState}
          roles={this.props.roles}
          pacientes={this.props.pacientes}
          historiasclinicas={this.props.historiasclinicas}
          cambiarIcono={true}
          paciente={this.props.paciente}
          permisos={this.props.permisos}
        />
      );
  }
}

export default ComponentSeeClinicHistory;
