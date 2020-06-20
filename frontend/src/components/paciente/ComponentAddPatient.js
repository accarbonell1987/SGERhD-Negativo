//Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message } from "semantic-ui-react";
import Swal from "sweetalert2";

//CSS
import "../global/css/Gestionar.css";

class ComponentAddPatient extends Component {
  state = {
    openModal: false,
    nombre: "",
    apellidos: "",
    ci: "",
    direccion: "",
    direccionopcional: "",
    telefono: "",
    sexo: "",
    madre: "",
    hijos: [],
    transfusiones: [],
    embarazos: [],
    examenes: [],
    activo: true,
    errornombre: false,
    errorapellidos: false,
    errorci: false,
    errordireccion: false,
    errortelefono: false,
    errorform: false,
  };

  generos = [
    { key: "M", text: "Masculino", value: "M", icon: "man" },
    { key: "F", text: "Femenino", value: "F", icon: "woman" },
  ];

  constructor(props) {
    super(props);

    this.addPatient = this.addPatient.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.ClearModalState = this.ClearModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }

  //componente se monto
  componentDidMount() {
    this.ClearModalState();
  }

  //adicionar nuevo paciente
  addPatient = async () => {
    const { nombre, apellidos, ci, direccion, direccionopcional, telefono, sexo, activo } = this.state;

    const fecha = Date.now();
    const paciente = {
      fechaDeCreacion: fecha,
      nombre: nombre,
      apellidos: apellidos,
      ci: ci,
      direccion: direccion,
      direccionopcional: direccionopcional,
      telefono: telefono,
      sexo: sexo,
      activo: activo,
    };
    //la promise debe de devolver un valor RETURN
    try {
      const res = await fetch(this.props.parentState.endpoint + "api/paciente/", {
        method: "POST",
        body: JSON.stringify(paciente),
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
  };
  //validar el formulario
  HandleSubmit = (evt) => {
    evt.preventDefault();

    this.setState({ errform: false });

    let soloLetras = /^[a-zA-Z ]+$/;
    let soloNumeros = /^([0-9])*$/;

    let errornombre = !this.state.nombre.match(soloLetras) ? { content: "El nombre solo debe de contener letras", pointing: "below" } : false;
    let errorapellidos = !this.state.apellidos.match(soloLetras) ? { content: "Apellidos solo debe de contener letras", pointing: "below" } : false;
    let errorci =
      !this.state.ci.toString().match(soloNumeros) || this.state.ci.length !== 11
        ? { content: "El carnet de identidad solo debe de contener números y ser igual a 11 dígitos", pointing: "below" }
        : false;
    let errortelefono = !this.state.telefono.toString().match(soloNumeros) ? { content: "El teléfono solo debe de contener números", pointing: "below" } : false;

    let enombre = Boolean(errornombre);
    let eapellidos = Boolean(errorapellidos);
    let eci = Boolean(errorci);
    let etelefono = Boolean(errortelefono);

    let errform = enombre || eapellidos || eci || etelefono;

    this.setState({
      errornombre: errornombre,
      errorapellidos: errorapellidos,
      errorci: errorci,
      errortelefono: errortelefono,
      errform: errform,
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
      this.setState({ openModal: true });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.setState({ openModal: false });
    } else {
      //si no hay problemas en el formulario
      if (this.HandleSubmit(evt) === false) {
        //si no hay problemas en la insercion
        if (await this.addPatient()) {
          //enviar a recargar los pacientes
          this.props.GetDataFromServer();
          this.ClearModalState();
        }
      }
    }
  };
  //limpiar states
  ClearModalState = () => {
    this.setState({
      openModal: false,
      nombre: "",
      apellidos: "",
      ci: "",
      direccion: "",
      direccionopcional: "",
      telefono: "",
      sexo: "",
      madre: "",
      hijos: [],
      transfusiones: [],
      embarazos: [],
      examenes: [],
      activo: true,
      errornombre: false,
      errorapellidos: false,
      errorci: false,
      errordireccion: false,
      errortelefono: false,
      errorform: false,
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
        <Button floated={position} icon labelPosition="left" primary size="small" onClick={this.ChangeModalState} className="modal-button-add">
          <Icon name="add circle" className="modal-icon-add" />
          Adicionar
        </Button>
      );
  };

  render() {
    return (
      <Modal open={this.state.openModal} trigger={this.changeIconInAddButton(this.props.cambiarIcono)}>
        <Header icon="wheelchair" content="Adicionar Paciente" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Input
              required
              name="nombre"
              icon="address card outline"
              iconPosition="left"
              label="Nombre:"
              value={this.state.nombre}
              placeholder="Facundo"
              error={this.state.errornombre}
              onChange={this.ChangeModalInput}
            />
            <Form.Input
              required
              name="apellidos"
              icon="address card outline"
              iconPosition="left"
              label="Apellidos:"
              value={this.state.apellidos}
              error={this.state.errorapellidos}
              placeholder="Correcto Inseguro"
              onChange={this.ChangeModalInput}
            />
            <Form.Input
              required
              name="ci"
              icon="vcard"
              iconPosition="left"
              label="Carnet de Identidad:"
              value={this.state.ci}
              placeholder="90112050112"
              error={this.state.errorci}
              onChange={this.ChangeModalInput}
            />
            <Form.Input
              required
              name="direccion"
              icon="building outline"
              iconPosition="left"
              label="Dirección:"
              value={this.state.direccion}
              placeholder="Calle 6 No.512..."
              onChange={this.ChangeModalInput}
            />
            <Form.Input
              name="direccionopcional"
              icon="building outline"
              iconPosition="left"
              label="Dirección Opcional:"
              value={this.state.direccionopcional}
              placeholder="Calle 6 No.512..."
              onChange={this.ChangeModalInput}
            />
            <Form.Input
              required
              name="telefono"
              icon="phone"
              iconPosition="left"
              label="Teléfono:"
              value={this.state.telefono}
              placeholder="52802640"
              onChange={this.ChangeModalInput}
              error={this.state.errortelefono}
            />
            <Form.Select
              required
              name="sexo"
              label="Género:"
              placeholder="Seleccionar Género"
              options={this.generos}
              value={this.state.sexo}
              error={this.state.errorsexo}
              onChange={(e, { value }) => {
                this.setState({ sexo: value });
              }}
              fluid
              selection
              clearable
            />
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
            disabled={!this.state.nombre || !this.state.apellidos || !this.state.ci || !this.state.direccion || !this.state.telefono || !this.state.sexo}
          >
            <Icon name="checkmark" /> Aceptar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ComponentAddPatient;
