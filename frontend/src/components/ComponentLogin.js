//Importaciones
import React, { Component } from "react";
import { Button, Form, Grid, Header, Image } from "semantic-ui-react";
import Swal from "sweetalert2";

//CSS
import "./global/css/Login.css";

//Definicion de la Clase
class ComponentLogin extends Component {
  state = {
    nombre: "",
    contraseña: "",
  };

  constructor(props) {
    super(props);

    this.handleAutenticateClick = this.handleAutenticateClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //componenten mixin
  swalToast = Swal.mixin({
    toast: true,
    position: "bottom-left",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  componentDidMount() {
    this.GetComienzo();
  }

  GetComienzo = async () => {
    await fetch(this.props.global.endpoint + "api/seguridad/comienzo", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.message,
            text: "Se ha creado el usuario del sistema (usuario:administrador, contraseña: administrador)",
            showConfirmButton: false,
            timer: 10000,
          });
        } else if (data.status === 202) {
          //luego veremos que hacemos aca
        } else {
          Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
        }
      })
      .catch((err) => {
        Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
      });
  };
  handleAutenticateClick = (evt) => {
    evt.preventDefault();

    fetch(this.props.global.endpoint + "api/seguridad/autenticar", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((jsondata) => {
        //capturar respuesta
        const { status, message, token, data } = jsondata;
        if (status === 200) {
          Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 1500 });
          // this.swalToast.fire({icon:'success', title: message});
          this.props.Login(data.nombre, data.rol, token);
        } else {
          Swal.fire({ position: "center", icon: "error", title: "Usuario o contraseña incorrecto", showConfirmButton: false, timer: 5000 });
          this.setState({ contraseña: "" });
        }
      })
      .catch((err) => {
        Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 });
        this.setState({ contraseña: "" });
      });
  };
  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle" style={{ height: "100vh" }} className="login-allgrid">
        <Grid.Column style={{ maxWidth: 350 }} className="login-allcolumn">
          <Grid.Row className="headerrow">
            <Header>
              <Image src={require("./global/images/logovletras.png")} className="headerimage" />
            </Header>
          </Grid.Row>
          <Form>
            <Grid.Row className="contentrow">
              <Grid columns={1} relaxed="very" stackable>
                <Grid.Column className="contentrowcolumn">
                  <Form.Input name="nombre" icon="user" iconPosition="left" label="Usuario" placeholder="Usuario" onChange={this.handleChange} />
                  <Form.Input name="contraseña" icon="lock" iconPosition="left" label="Contraseña" value={this.state.contraseña} type="password" onChange={this.handleChange} />
                </Grid.Column>
              </Grid>
            </Grid.Row>
            <Grid.Row className="contentrowbutton">
              <Button content="Ingresar" icon="check" primary onClick={this.handleAutenticateClick} type="submit" disabled={!this.state.nombre || !this.state.contraseña} />
            </Grid.Row>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ComponentLogin;
