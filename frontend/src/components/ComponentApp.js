//#region  Importaciones
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
//#endregion

//#region CSS
import "./global/css/Content.css";
//#endregion

//#region Componentes
import ComponentLogin from "./ComponentLogin";
import ComponentDashboard from "./ComponentDashboard";
//#endregion

//#region Definicion de la clase
class ComponentApp extends Component {
  state = {
    autenticado: false,
  };

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  permisos = [
    {
      rol: "usuario",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "historiaclinica", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "pacientes", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "examenes", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "transfusiones", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "embarazos", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
      ],
    },
    {
      rol: "recepcionista",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: false } },
        { opcion: "historiaclinica", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "pacientes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "examenes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "embarazos", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
      ],
    },
    {
      rol: "informatico",
      accesos: [
        { opcion: "usuarios", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "historiaclinica", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "pacientes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "examenes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "embarazos", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
      ],
    },
    {
      rol: "especialista",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: false } },
        { opcion: "historiaclinica", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "pacientes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "examenes", permisos: { crear: false, leer: true, modificar: true, eliminar: false, menu: true } },
        { opcion: "transfusiones", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "embarazos", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
      ],
    },
    {
      rol: "doctor",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: false } },
        { opcion: "historiaclinica", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "pacientes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "examenes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "embarazos", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
      ],
    },
  ];

  roles = [
    { key: "usuario", text: "Usuario", value: "usuario", image: { avatar: true, src: require("./global/images/jenny.jpg") } },
    { key: "recepcionista", text: "Recepcionista", value: "recepcionista", image: { avatar: true, src: require("./global/images/molly.png") } },
    { key: "informatico", text: "Informático", value: "informatico", image: { avatar: true, src: require("./global/images/steve.jpg") } },
    { key: "especialista", text: "Especialista", value: "especialista", image: { avatar: true, src: require("./global/images/stevie.jpg") } },
    { key: "doctor", text: "Doctor", value: "doctor", image: { avatar: true, src: require("./global/images/elliot.jpg") } },
  ];

  constructor(props) {
    super(props);

    //bindeos de metodos con los this
    this.Login = this.Login.bind(this);
    this.Deslogin = this.Deslogin.bind(this);
    this.GetCookies = this.GetCookies.bind(this);
  }

  //Loguearse
  Login = (usuario, rol, token) => {
    //setear en las cookies los valores que necesito durante todo el life
    const { cookies } = this.props;

    const data = {
      autenticado: true,
      usuario: usuario,
      rol: rol,
      logintime: new Date(),
      token: token,
    };
    cookies.set("data", data, { maxAge: 1400 });
    //setear el state autenticado en true
    this.setState({ autenticado: true });
  };

  //Desloguearse
  Deslogin = () => {
    //cambiando el estado para renderizar el componente
    this.setState({ autenticado: false });
  };

  GetCookies = () => {
    //obtener las cookies
    const { cookies } = this.props;
    const cookieData = cookies.get("data");
    return cookieData;
  };

  render() {
    //global
    const global = {
      permisos: this.permisos,
      roles: this.roles,
      endpoint: process.env.REACT_APP_API_PATH_LOCAL,
      cookies: () => this.GetCookies(),
    };
    if (this.state.autenticado) {
      return <ComponentDashboard global={global} Deslogin={this.Deslogin} />;
    } else {
      return <ComponentLogin Login={this.Login} global={global} />;
    }
  }
}
//#endregion

//#region Exports
export default withCookies(ComponentApp);
//#endregion
