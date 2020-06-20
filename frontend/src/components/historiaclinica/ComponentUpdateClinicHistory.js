//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Definicion de Clase
class ComponentUpdateClinicHistory extends Component {
  //#region Estados y Declaraciones
  state = {
    openModal: false,
    areaDeSalud: "",
    numerohistoria: "",
    vacunaAntiD: false,
    numeroDeEmbarazos: 0,
    numeroDePartos: 0,
    numeroDeAbortos: 0,
    paciente: "",
    opcionPacientes: [],
    activo: true,
    errorareaDeSalud: false,
    errornumerohistoria: false,
    errorpaciente: false,
    errorform: false,
  };

  generos = [
    { key: "M", text: "Masculino", value: "M", icon: "man" },
    { key: "F", text: "Femenino", value: "F", icon: "woman" },
  ];
  //#endregion

  //#region Constructor
  constructor(props) {
    super(props);

    this.ClearModalState = this.ClearModalState.bind(this);
    this.UpdateClinicHistory = this.UpdateClinicHistory.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }
  //#endregion

  //#region Metodos y Eventos
  shouldComponentUpdate() {
    const data = this.props.global.cookies();
    if (!data) {
      this.props.Deslogin();
      return false;
    }
    return true;
  }
  SwalAlert = (posicion, icon, mensaje, tiempo) => {
    Swal.fire({
      position: posicion,
      icon: icon,
      title: mensaje,
      showConfirmButton: false,
      timer: tiempo,
    });
  };
  //modificar paciente
  UpdateClinicHistory = async (id) => {
    //chequear que las cookies tengan los datos necesarios
    const data = this.props.global.cookies();
    if (!data) this.props.Deslogin();
    else {
      const { areaDeSalud, numerohistoria, vacunaAntiD, numeroDeEmbarazos, numeroDePartos, numeroDeAbortos, paciente, activo } = this.state;

      const fecha = new Date();
      const historiaclinica = {
        fechaDeCreacion: fecha,
        areaDeSalud: areaDeSalud,
        numerohistoria: numerohistoria,
        vacunaAntiD: vacunaAntiD,
        numeroDeEmbarazos: numeroDeEmbarazos,
        numeroDePartos: numeroDePartos,
        numeroDeAbortos: numeroDeAbortos,
        paciente: paciente,
        activo: activo,
      };
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.global.endpoint + "api/historiaclinica/" + id, {
          method: "PATCH",
          body: JSON.stringify(historiaclinica),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "access-token": data.token,
          },
        });
        let serverdata = await res.json();
        const { status, message } = serverdata;
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
    }
  };
  //validar el formulario
  HandleSubmit = (evt) => {
    evt.preventDefault();

    this.setState({
      errorareaDeSalud: false,
      errornumerohistoria: false,
      errorpaciente: false,
      errform: false,
    });

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
    const disabled = !this.state.numerohistoria || !this.state.areaDeSalud || !this.state.paciente;
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
      if (await this.UpdateClinicHistory(this.props.historiaclinica._id)) {
        //enviar a recargar los usuarios
        this.props.GetDataFromServer();
        this.ClearModalState();
      }
    }
  };
  //cambiar el estado en el MODAL para adicionar usuario
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("modal-button-action") || evt.target.className.includes("modal-icon")) {
      this.ClearModalState();
      this.setState({
        openModal: true,
        areaDeSalud: this.props.historiaclinica.areaDeSalud,
        numerohistoria: this.props.historiaclinica.numerohistoria,
        vacunaAntiD: this.props.historiaclinica.vacunaAntiD,
        numeroDeEmbarazos: this.props.historiaclinica.numeroDeEmbarazos,
        numeroDePartos: this.props.historiaclinica.numeroDePartos,
        numeroDeAbortos: this.props.historiaclinica.numeroDeAbortos,
        paciente: this.props.historiaclinica.paciente,
        activo: this.props.historiaclinica.activo,
      });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.ClearModalState();
    } else {
      this.OnSubmit(evt);
    }
  };
  //limpiar states
  ClearModalState = () => {
    let opcion = [];
    this.props.pacientes.forEach((p) => {
      //validacion si el paciente tiene una historia no se debe de mostrar
      //en caso de que sea mayor que cero
      if (this.props.historiasclinicas.length > 0) {
        //busco los pacientes que no tengan historias validas
        if (!this.props.historiasclinicas.some((h) => h.paciente._id === p._id) || this.props.historiaclinica.paciente._id === p._id) {
          let nombreyapellidos = p.nombre + " " + p.apellidos;
          let cur = {
            key: p._id,
            text: nombreyapellidos,
            value: p._id,
            icon: "wheelchair",
          };
          opcion = [...opcion, cur];
        }
      } else {
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

    this.setState({
      openModal: false,
      areaDeSalud: "",
      numerohistoria: "",
      vacunaAntiD: false,
      numeroDeEmbarazos: 0,
      numeroDePartos: 0,
      numeroDeAbortos: 0,
      paciente: "",
      opcionPacientes: opcion,
      activo: true,
      errorareaDeSalud: false,
      errornumerohistoria: false,
      errorpaciente: false,
      errorform: false,
    });
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
        <Header icon="clipboard" content="Modificar Paciente" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Input required disabled name="numerohistoria" icon="address card outline" iconPosition="left" label="Numero de Historia:" value={this.state.numerohistoria} />
            <Segment.Group horizontal className="modal-segment-group">
              <Segment className="modal-segment-longleft">
                <Form.Input
                  required
                  name="areaDeSalud"
                  icon="hospital symbol"
                  iconPosition="left"
                  label="Area de Salud:"
                  value={this.state.areaDeSalud}
                  placeholder="Consultorio, Policlinico, Hospital"
                  onChange={this.ChangeModalInput}
                  onKeyDown={this.OnPressEnter}
                />
              </Segment>
              <Segment className="modal-segment-shortright">
                <Form.Group>
                  <Segment className="modal-segment-expanded">
                    <Header as="h5">Vacuna Anti-D:</Header>
                    <Form.Checkbox
                      toggle
                      name="vacunaAntiD"
                      labelPosition="left"
                      label={this.state.vacunaAntiD === true ? "Si" : "No"}
                      value={this.state.vacunaAntiD}
                      checked={this.state.vacunaAntiD}
                      onChange={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          vacunaAntiD: !this.state.vacunaAntiD,
                        });
                      }}
                    />
                  </Segment>
                </Form.Group>
              </Segment>
            </Segment.Group>
            <Segment.Group horizontal>
              <Segment>
                <Form.Group>
                  <Form.Input
                    className="modal-input-30p"
                    required
                    name="numeroDeEmbarazos"
                    icon="user md"
                    iconPosition="left"
                    label="Numero de Embarazos:"
                    value={this.state.numeroDeEmbarazos}
                  />
                  <Button.Group>
                    <Button
                      className="button-group-addsub"
                      icon="plus"
                      primary
                      onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          numeroDeEmbarazos: this.state.numeroDeEmbarazos + 1,
                        });
                      }}
                    />
                    <Button
                      className="button-group-addsub"
                      icon="minus"
                      secondary
                      disabled={this.state.numeroDeEmbarazos === 0}
                      onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          numeroDeEmbarazos: this.state.numeroDeEmbarazos - 1,
                        });
                      }}
                    />
                  </Button.Group>
                </Form.Group>
              </Segment>
              <Segment>
                <Form.Group>
                  <Form.Input
                    className="modal-input-30p"
                    required
                    name="numeroDePartos"
                    icon="user md"
                    iconPosition="left"
                    label="Numero de Partos:"
                    value={this.state.numeroDePartos}
                  />
                  <Button.Group>
                    <Button
                      className="button-group-addsub"
                      icon="plus"
                      primary
                      onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          numeroDePartos: this.state.numeroDePartos + 1,
                        });
                      }}
                    />
                    <Button
                      className="button-group-addsub"
                      icon="minus"
                      secondary
                      disabled={this.state.numeroDePartos === 0}
                      onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          numeroDePartos: this.state.numeroDePartos - 1,
                        });
                      }}
                    />
                  </Button.Group>
                </Form.Group>
              </Segment>
              <Segment>
                <Form.Group>
                  <Form.Input
                    className="modal-input-30p"
                    required
                    name="numeroDeAbortos"
                    icon="user md"
                    iconPosition="left"
                    label="Numero de Abortos:"
                    value={this.state.numeroDeAbortos}
                  />
                  <Button.Group>
                    <Button
                      className="button-group-addsub"
                      icon="plus"
                      primary
                      onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          numeroDeAbortos: this.state.numeroDeAbortos + 1,
                        });
                      }}
                    />
                    <Button
                      className="button-group-addsub"
                      icon="minus"
                      secondary
                      disabled={this.state.numeroDeAbortos === 0}
                      onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                          numeroDeAbortos: this.state.numeroDeAbortos - 1,
                        });
                      }}
                    />
                  </Button.Group>
                </Form.Group>
              </Segment>
            </Segment.Group>
            <Form.Select
              name="paciente"
              label="Paciente:"
              placeholder="Seleccionar Paciente"
              options={this.state.opcionPacientes}
              value={this.state.paciente._id}
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
            <Icon name="remove" className="modal-icon-cancel" /> Cancelar
          </Button>
          <Button
            color="green"
            onClick={this.ChangeModalState}
            className="modal-button-accept"
            type="submit"
            disabled={!this.state.numerohistoria || !this.state.areaDeSalud || !this.state.paciente}
          >
            <Icon name="checkmark" /> Aceptar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  //#endregion
}
//#endregion

//#region Exports
export default ComponentUpdateClinicHistory;
//#endregion
