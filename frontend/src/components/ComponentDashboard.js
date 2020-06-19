//#region Importaciones
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
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
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  state = {
    opcionmenu: "embarazos",
  };

  constructor(props) {
    super(props);
    this.changeMenuOption = this.changeMenuOption.bind(this);
  }

  changeMenuOption = (opcion) => {
    const cookieData = this.props.global.cookies();

    if (!cookieData) this.props.Deslogin();
    else this.setState({ opcionmenu: opcion });
  };

  render() {
    const cookieData = this.props.global.cookies();
    //chequear si esta autenticado
    if (cookieData.autenticado) {
      return (
        <div className="Dashboard">
          <ComponentHeader global={this.props.global} Deslogin={this.props.Deslogin} />
          <ComponentMenu changeMenuOption={this.changeMenuOption} opcionmenu={this.state.opcionmenu} global={this.props.global} />
          {/* <ComponentContent UnSetLogin={this.props.UnSetLogin} opcionmenu={this.state.opcionmenu} global={this.props.global} /> */}
        </div>
      );
    }
  }
}
//#endregion

//#region Exports
export default withCookies(ComponentDashboard);
//#endregion
