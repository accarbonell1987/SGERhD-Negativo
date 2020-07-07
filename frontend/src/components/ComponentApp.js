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
        { opcion: "analisis", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "transfusiones", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "embarazos", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "reportes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
      ],
    },
    {
      rol: "recepcionista",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "historiaclinica", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "pacientes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "examenes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "analisis", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "embarazos", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "reportes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
      ],
    },
    {
      rol: "informatico",
      accesos: [
        { opcion: "usuarios", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "historiaclinica", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "pacientes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "examenes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "analisis", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "embarazos", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "reportes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
      ],
    },
    {
      rol: "especialista",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "historiaclinica", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "pacientes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "examenes", permisos: { crear: false, leer: true, modificar: true, eliminar: false, menu: true } },
        { opcion: "analisis", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "embarazos", permisos: { crear: false, leer: false, modificar: false, eliminar: false, menu: false } },
        { opcion: "reportes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
      ],
    },
    {
      rol: "doctor",
      accesos: [
        { opcion: "usuarios", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
        { opcion: "historiaclinica", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "pacientes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "examenes", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "analisis", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "transfusiones", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "embarazos", permisos: { crear: true, leer: true, modificar: true, eliminar: true, menu: true } },
        { opcion: "reportes", permisos: { crear: false, leer: true, modificar: false, eliminar: false, menu: true } },
      ],
    },
  ];

  colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];

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
    this.SetMenuCookie = this.SetMenuCookie.bind(this);
  }

  componentDidMount() {
    const auth = this.GetCookies() || false;
    this.setState({ autenticado: auth });
  }
  //Loguearse
  Login = (usuario, rol, token) => {
    //setear en las cookies los valores que necesito durante todo el life
    const { cookies } = this.props;
    //eliminar las cookies para recomenzar el tiempo de expiracion
    cookies.remove("data");
    cookies.remove("menu");

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
    //eliminando las cookies
    const { cookies } = this.props;
    cookies.remove("data");
    cookies.remove("menu");
    //cambiando el estado para renderizar el componente
    this.setState({ autenticado: false });
  };
  //Obtener las cookies con los datos relacionados al Login
  GetCookies = () => {
    //obtener las cookies
    const { cookies } = this.props;
    const data = cookies.get("data");
    return data;
  };
  //establecer la ultima opcion en la cookie menu con el ultimo menu seleccionado
  SetMenuCookie = (opcionmenu) => {
    const { cookies } = this.props;
    //setear el ultimo menu seleccionado
    cookies.set("menu", opcionmenu);
  };
  //obtener el ultimo menu seleccionado
  GetMenuCookies = () => {
    //obtener las cookies
    const { cookies } = this.props;
    const data = cookies.get("menu");
    return data;
  };

  render() {
    //global
    const global = {
      permisos: this.permisos,
      roles: this.roles,
      endpoint: process.env.REACT_APP_API_PATH_LOCAL,
      cookies: () => this.GetCookies(),
    };
    const menu = this.GetMenuCookies() || "pacientes";

    if (this.state.autenticado) {
      return <ComponentDashboard global={global} Deslogin={this.Deslogin} menu={menu} SetMenuCookie={this.SetMenuCookie} />;
    } else {
      return <ComponentLogin Login={this.Login} global={global} />;
    }
  }
}
//#endregion

//#region Exports
export default withCookies(ComponentApp);
//#endregion
