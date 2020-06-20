//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Definicion de Clase
class ComponentAddUser extends Component {
  state = {
    openModal: false,
    nombre: "",
    contraseña: "",
    repetircontraseña: "",
    email: "",
    rol: "",
    activo: true,
    errornombre: false,
    errorcontraseña: false,
    errorcontraseñacoincide: false,
    erroremail: false,
    errorrol: false,
    errorform: false,
  };

  constructor(props) {
    super(props);

    this.AddUser = this.AddUser.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.ClearModalState = this.ClearModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  //componente se monto
  componentDidMount() {
    this.ClearModalState();
  }

  //adicionar nuevo usuario
  AddUser = async () => {
    //chequear que las cookies tengan los datos necesarios
    const data = this.props.global.cookies();
    if (!data) this.props.Deslogin();

    const { nombre, contraseña, repetircontraseña, email, rol, activo } = this.state;
    const usuario = {
      nombre: nombre,
      contraseña: contraseña,
      repetircontraseña: repetircontraseña,
      email: email,
      rol: rol,
      activo: activo,
    };
    //la promise debe de devolver un valor RETURN
    try {
      const res = await fetch(this.props.global.endpoint + "api/usuario/", {
        method: "POST",
        body: JSON.stringify(usuario),
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
        Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 3000 }); //mostrar mensaje
        return true;
      } else {
        Swal.fire({ position: "center", icon: "error", title: message, showConfirmButton: false, timer: 5000 }); //mostrar mensaje
        return false;
      }
    } catch (err) {
      Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
      return false;
    }
  };
  //validar el formulario
  HandleSubmit = (evt) => {
    evt.preventDefault();

    this.setState({ errform: false });

    let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;

    let errorcontraseña = this.state.contraseña.length < 8 ? { content: "La contraseña debe de tener mas de 8 caracteres", pointing: "below" } : false;
    let errorcontraseñacoincide = this.state.repetircontraseña !== this.state.contraseña ? { content: "La contraseñas no coinciden", pointing: "below" } : false;
    let erroremail = !this.state.email.match(mailformat) ? { content: "Formato de correo incorrecto (corre@host.dominio)", pointing: "below" } : false;
    let errorrol = this.state.rol === "" ? { content: "Debe de escoger un rol", pointing: "below" } : false;

    let econtraseña = Boolean(errorcontraseña);
    let econtraseñacoincide = Boolean(errorcontraseñacoincide);
    let eemail = Boolean(erroremail);
    let erol = Boolean(errorrol);

    let errform = econtraseña || econtraseñacoincide || eemail || erol;

    this.setState({
      errorcontraseña: errorcontraseña,
      errorcontraseñacoincide: errorcontraseñacoincide,
      erroremail: erroremail,
      errorrol: errorrol,
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
  //al presionar la tecla de ENTER
  OnPressEnter = (evt) => {
    const disabled = !this.state.nombre || !this.state.email || !this.state.rol || !this.state.contraseña || !this.state.repetircontraseña;
    if (evt.keyCode === 13 && !evt.shiftKey && !disabled) {
      evt.preventDefault();
      this.OnSubmit(evt);
    }
  };
  //al enviar a aplicar el formulario
  OnSubmit = async (evt) => {
    if (this.HandleSubmit(evt) === false) {
      //si no hay problemas en la insercion
      if (await this.AddUser()) {
        //enviar a recargar los usuarios
        this.props.GetDataFromServer();
        this.ClearModalState();
      }
    }
  };
  //cambiar el estado en el MODAL para adicionar usuario
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("modal-button-add")) {
      this.setState({ openModal: true });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.setState({ openModal: false });
    } else {
      this.OnSubmit(evt);
    }
  };
  //limpiar states
  ClearModalState = () => {
    this.setState({
      openModal: false,
      nombre: "",
      contraseña: "",
      repetircontraseña: "",
      email: "",
      rol: "",
      activo: true,
      errornombre: false,
      errorcontraseña: false,
      errorcontraseñacoincide: false,
      erroremail: false,
      errorrol: false,
      errorform: false,
    });
  };
  //cambiar el icono en el AddButton
  ChangeIconInAddButton = (allow, change) => {
    const position = this.props.middleButtonAdd ? "middle" : "right";
    if (change)
      return (
        <Button
          icon
          floated={position}
          labelPosition="right"
          className="modal-button-add"
          onClick={(evt) => {
            this.ChangeModalState(evt, allow);
          }}
        >
          <Icon
            name="add user"
            className="modal-icon-add"
            onClick={(evt) => {
              this.ChangeModalState(evt, allow);
            }}
          />
          Adicionar
        </Button>
      );
    else
      return (
        <Button
          floated={position}
          icon
          labelPosition="left"
          primary
          size="small"
          onClick={(evt) => {
            this.ChangeModalState(evt, allow);
          }}
          className="modal-button-add"
        >
          <Icon name="add user" className="modal-icon-add" />
          Adicionar
        </Button>
      );
  };

  render() {
    const data = this.props.global.cookies();

    const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find((p) => p.opcion === "transfusiones");
    //chequear si es historiasclinica y tengo permiso
    return (
      <Modal
        open={this.state.openModal}
        trigger={accesomenu.permisos.crear ? this.ChangeIconInAddButton(true, this.props.cambiarIcono) : this.ChangeIconInAddButton(false, this.props.cambiarIcono)}
      >
        <Header icon="user" content="Adicionar Usuario" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" OnSubmit={this.ChangeModalState}>
            <Form.Input
              required
              name="nombre"
              icon="user"
              iconPosition="left"
              label="Nombre:"
              placeholder="nombre de usuario"
              error={this.state.errornombre}
              onChange={this.ChangeModalInput}
              onKeyDown={this.OnPressEnter}
            />
            <Form.Input
              required
              name="email"
              icon="mail"
              iconPosition="left"
              label="Correo Electrónico:"
              value={this.state.email}
              error={this.state.erroremail}
              placeholder="correo@host.com"
              onChange={this.ChangeModalInput}
              onKeyDown={this.OnPressEnter}
            />
            <Form.Select
              required
              name="rol"
              label="Rol:"
              placeholder="Seleccionar Rol"
              options={this.props.global.roles}
              error={this.state.errorrol}
              onChange={(e, { value }) => {
                this.setState({ rol: value });
              }}
              fluid
              selection
              clearable
            />
            <Form.Input
              required
              name="contraseña"
              icon="lock"
              iconPosition="left"
              label="Contraseña:"
              value={this.state.contraseña}
              error={this.state.errorcontraseña}
              type="password"
              onChange={this.ChangeModalInput}
              onKeyDown={this.OnPressEnter}
            />
            <Form.Input
              required
              name="repetircontraseña"
              icon="lock"
              iconPosition="left"
              label="Repetir Contraseña:"
              value={this.state.repetircontraseña}
              error={this.state.errorcontraseñacoincide}
              type="password"
              onChange={this.ChangeModalInput}
              onKeyDown={this.OnPressEnter}
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
            className="modal-button-acept"
            type="submit"
            disabled={!this.state.nombre || !this.state.email || !this.state.rol || !this.state.contraseña || !this.state.repetircontraseña}
          >
            <Icon name="checkmark" /> Aceptar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
//#endregion

//#region Exports
export default ComponentAddUser;
//#endregion
