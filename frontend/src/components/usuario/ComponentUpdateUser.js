//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Definicion de Clase
class ComponentUpdateUser extends Component {
  //#region Estados y Declaraciones
  state = {
    openModal: false,
    nombre: "",
    email: "",
    rol: "",
    activo: false,
    erroremail: false,
    errorrol: false,
    errorform: false,
  };
  //#endregion

  //#region Constructor
  constructor(props) {
    super(props);

    this.ClearModalState = this.ClearModalState.bind(this);
    this.UpdateUser = this.UpdateUser.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
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
  //modificar usuario
  UpdateUser = async (id) => {
    //chequear que las cookies tengan los datos necesarios
    const data = this.props.global.cookies();
    if (!data) this.props.Deslogin();
    else {
      const { email, rol, activo } = this.state;
      const usuario = {
        email: email,
        rol: rol,
        activo: activo,
      };
      //la promise debe de devolver un valor RETURN
      try {
        const res = await fetch(this.props.global.endpoint + "api/usuario/" + id, {
          method: "PATCH",
          body: JSON.stringify(usuario),
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

    this.setState({ errform: false });

    let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;

    let erroremail = !this.state.email.match(mailformat) ? { content: "Formato de correo incorrecto (corre@host.dominio)", pointing: "below" } : false;
    let errorrol = this.state.rol === "" ? { content: "Debe de escoger un rol", pointing: "below" } : false;
    let eemail = Boolean(erroremail);
    let erol = Boolean(errorrol);

    let errform = eemail || erol;

    this.setState({
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
    const disabled = !this.state.nombre || !this.state.email || !this.state.rol;
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
      if (await this.UpdateUser(this.props.usuario._id)) {
        //enviar a recargar los usuarios
        this.props.GetDataFromServer();
        this.ClearModalState();
      }
    }
  };
  //cambiar el estado en el MODAL para adicionar usuario
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("modal-button-action") || evt.target.className.includes("modal-icon")) {
      // this.getUser(this.props.usuario._id);
      this.setState({
        nombre: this.props.usuario.nombre,
        email: this.props.usuario.email,
        rol: this.props.usuario.rol,
        activo: this.props.usuario.activo,
        openModal: true,
      });
    } else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
      this.ClearModalState();
    } else {
      this.OnSubmit(evt);
    }
  };
  //limpiar states
  ClearModalState = () => {
    this.setState({
      openModal: false,
      nombre: "",
      email: "",
      rol: "",
      erroremail: false,
      errorrol: false,
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
        <Header icon="user" content="Modificar Usuario" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            <Form.Input
              disabled
              required
              name="nombre"
              icon="user"
              iconPosition="left"
              label="Nombre:"
              value={this.state.nombre}
              error={this.state.errornombre}
              placeholder="nombre de usuario"
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
              value={this.state.rol}
              error={this.state.errorrol}
              onChange={(e, { value }) => {
                this.setState({ rol: value });
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
          <Button color="green" onClick={this.ChangeModalState} className="modal-button-acept" type="submit" disabled={!this.state.nombre || !this.state.email || !this.state.rol}>
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
export default ComponentUpdateUser;
//#endregion
