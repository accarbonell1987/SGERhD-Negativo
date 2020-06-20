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

  render() {
    const data = this.props.global.cookies();
    //chequear si esta autenticado
    if (data.autenticado) {
      return (
        <div className="Dashboard">
          <ComponentHeader global={this.props.global} Deslogin={this.props.Deslogin} />
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
