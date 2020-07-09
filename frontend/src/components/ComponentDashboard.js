//#region Importaciones
import React, { Component } from "react";
//#endregion

//#region CSS
import "./global/css/Content.css";
//#endregion

//#region Componentes
import ComponentHeader from "./ComponentHeader";
import ComponentContent from "./ComponentContent";
import ComponentMenu from "./ComponentMenu";
//#endregion

//#region Definicion de la clase
class ComponentDashboard extends Component {
  state = {
    opcionmenu: this.props.menu,
  };

  constructor(props) {
    super(props);
    this.ChangeMenuOption = this.ChangeMenuOption.bind(this);
    this.GetData = this.GetData.bind(this);
  }

  componentDidMount() {
    this.props.SetMenuCookie(this.props.menu);
  }
  shouldComponentUpdate() {
    const data = this.props.global.cookies();
    if (!data) {
      this.props.Deslogin();
      return false;
    }
    return true;
  }
  ChangeMenuOption = (opcion) => {
    this.props.SetMenuCookie(opcion);
    this.setState({ opcionmenu: opcion });
  };
  GetData = () => {
    const data = this.props.global.cookies();
    const rol = this.props.global.roles.find((p) => p.key === data.rol);
    const imagen = rol.image.src;
    const nombrerol = data.usuario + " - " + data.rol;
    return { imagen: imagen, nombrerol: nombrerol };
  };

  render() {
    const data = this.props.global.cookies();
    const userdata = this.GetData();
    //chequear si esta autenticado
    if (data.autenticado) {
      return (
        <div className="Dashboard">
          <ComponentHeader global={this.props.global} Deslogin={this.props.Deslogin} userdata={userdata} />
          <ComponentMenu ChangeMenuOption={this.ChangeMenuOption} opcionmenu={this.state.opcionmenu} global={this.props.global} />
          <ComponentContent Deslogin={this.props.Deslogin} opcionmenu={this.state.opcionmenu} global={this.props.global} />
        </div>
      );
    }
  }
}
//#endregion

//#region Exports
export default ComponentDashboard;
//#endregion
