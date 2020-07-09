//Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Divider } from "semantic-ui-react";
import Swal from "sweetalert2";

//CSS
import "../global/css/Gestionar.css";

class ComponentChangePassword extends Component {
  state = {
    openModal: false,
    contraseña: "",
    repetircontraseña: "",
    contraseñaanterior: "",
    errorcontraseña: false,
    errorcontraseñacoincide: false,
    errorcontraseñaanterior: false,
    errorform: false,
    usuariocontraseña: "",
  };

  //constructor
  constructor(props) {
    super(props);

    this.ClearModalState = this.ClearModalState.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.ChangeModalInput = this.ChangeModalInput.bind(this);
    this.ChangeModalState = this.ChangeModalState.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }
  shouldComponentUpdate() {
    const data = this.props.global.cookies();
    if (!data) {
      this.props.Deslogin();
      return false;
    }
    return true;
  }
  //modificar usuario
  updateUser = async (id) => {
    const { contraseña } = this.state;
    const usuario = { contraseña };
    //la promise debe de devolver un valor RETURN
    try {
      const res = await fetch(this.props.global.endpoint + "api/usuario/password/" + id, {
        method: "PATCH",
        body: JSON.stringify(usuario),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "access-token": this.props.global.token,
        },
      });
      let jsondata = await res.json();
      const { status, message } = jsondata;
      if (status === 200) {
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

    let errorcontraseñaanterior = this.state.contraseñaanterior.length < 8 ? { content: "La contraseña debe de tener mas de 8 caracteres", pointing: "below" } : false;
    let errorcontraseña = this.state.contraseña.length < 8 ? { content: "La contraseña debe de tener mas de 8 caracteres", pointing: "below" } : false;
    let errorcontraseñacoincide = this.state.repetircontraseña !== this.state.contraseña ? { content: "La contraseñas no coinciden", pointing: "below" } : false;

    let eerrorcontraseñaanterior = Boolean(errorcontraseñaanterior);
    let econtraseña = Boolean(errorcontraseña);
    let econtraseñacoincide = Boolean(errorcontraseñacoincide);

    let errform = false;
    if (this.props.gestion) errform = econtraseña || econtraseñacoincide;
    else errform = econtraseña || econtraseñacoincide || eerrorcontraseñaanterior;

    this.setState({
      errorcontraseñaanterior: errorcontraseñaanterior,
      errorcontraseña: errorcontraseña,
      errorcontraseñacoincide: errorcontraseñacoincide,
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
  //cambiar el estado en el MODAL para adicionar usuario
  ChangeModalState = async (evt) => {
    if (evt.target.className.includes("modal-button-change-password") || evt.target.className.includes("modal-icon")) {
      this.setState({ openModal: true });
    } else if (evt.target.className.includes("modal-button-cancel")) {
      this.ClearModalState();
    } else {
      //si no hay problemas en el formulario
      if (this.HandleSubmit(evt) === false) {
        //chequear si se abrio el componente desde el gestionar o desde el cambiar clave de usuario
        if (!this.props.gestion) {
          //comparar las contraseñas antiguas == actual
          if (this.props.usuario.contraseña === this.state.contraseñaanterior) {
            //si no hay problemas modificando
            if (await this.updateUser(this.props.usuario._id)) {
              this.ClearModalState();
            }
          } else {
            this.setState({
              errorcontraseñaanterior: { content: "Las contraseña antigua no coincide con la del usuario", pointing: "below" },
              errorform: true,
            });
            Swal.fire({ position: "center", icon: "error", title: "Las contraseña antigua no coincide con la del usuario", showConfirmButton: false, timer: 5000 });
          }
        } else {
          //si no hay problemas modificando
          if (await this.updateUser(this.props.usuario._id)) {
            this.ClearModalState();
          }
        }
      }
    }
  };
  //limpiar states
  ClearModalState = () => {
    this.setState({
      openModal: false,
      contraseña: "",
      repetircontraseña: "",
      contraseñaanterior: "",
      errorcontraseña: false,
      errorcontraseñacoincide: false,
      errorcontraseñaanterior: false,
      errorform: false,
      usuariocontraseña: "",
    });
  };

  render() {
    return (
      <Modal
        open={this.state.openModal}
        trigger={
          <Button className="modal-button-change-password" onClick={this.ChangeModalState}>
            <Icon name="key" className="modal-icon" onClick={this.ChangeModalState} />
          </Button>
        }
      >
        <Header icon="user" content="Cambiar Contraseña" />
        <Modal.Content>
          {this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
          <Form ref="form" onSubmit={this.ChangeModalState}>
            {!this.props.gestion ? (
              <div>
                <Form.Input required name="contraseñaanterior" icon="lock" iconPosition="left" label="Contraseña Anterior:" value={this.state.contraseñaanterior} error={this.state.errorcontraseñaanterior} type="password" onChange={this.ChangeModalInput} />
                <Divider hidden />
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="key" />
                    Nuevos Datos
                  </Header>
                </Divider>
              </div>
            ) : (
              ""
            )}
            <Form.Input required name="contraseña" icon="lock" iconPosition="left" label="Contraseña:" value={this.state.contraseña} error={this.state.errorcontraseña} type="password" onChange={this.ChangeModalInput} />
            <Form.Input required name="repetircontraseña" icon="lock" iconPosition="left" label="Repetir Contraseña:" value={this.state.repetircontraseña} error={this.state.errorcontraseñacoincide} type="password" onChange={this.ChangeModalInput} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
            <Icon name="remove" /> Cancelar
          </Button>
          {this.props.gestion ? (
            <Button color="green" onClick={this.ChangeModalState} className="modal-button-acept" type="submit" disabled={!this.state.contraseña || !this.state.repetircontraseña}>
              <Icon name="checkmark" /> Aceptar
            </Button>
          ) : (
            <Button color="green" onClick={this.ChangeModalState} className="modal-button-acept" type="submit" disabled={!this.state.contraseñaanterior || !this.state.contraseña || !this.state.repetircontraseña}>
              <Icon name="checkmark" /> Aceptar
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ComponentChangePassword;
