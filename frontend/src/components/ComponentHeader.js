//#region Importaciones
import React, { Component } from "react";
import { Header, Image, Dropdown } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "./global/css/Header.css";
//#endregion

//#region Componentes
import ComponentChangePassword from "./usuario/ComponentChangePassword";
//#endregion

//#region Definicion de la Clase
class ComponentHeader extends Component {
  options = [
    { key: 1, text: "Cambiar Contraseña", icon: "key", value: "1" },
    { key: 2, text: "Salir", icon: "arrow alternate circle left outline", value: "2" },
  ];
  trigger = (
    <span>
      <Image avatar src={this.props.userdata.imagen} /> {this.props.userdata.nombrerol}
    </span>
  );

  constructor(props) {
    super(props);

    this.HandleAutenticarClick = this.HandleAutenticarClick.bind(this);
  }

  SwalToast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  HandleAutenticarClick = () => {
    this.SwalToast.fire({
      icon: "success",
      title: "Sessión Cerrada",
    });
    this.props.Deslogin();
  };

  render() {
    const data = this.props.global.cookies();
    return (
      <Header className="divheader">
        <a href="http://localhost:3000">
          <Image src={require("./global/images/logohletras.png")} className="logo" alt="logo" />
        </a>
        <div className="divbutton">
          <Dropdown
            trigger={this.trigger}
            options={this.options}
            pointing="top left"
            icon={null}
            onChange={(e, { value }) => {
              if (value === "1") {
                const usuario = { id: data.id, contraseña: data.pass };
                <ComponentChangePassword usuario={usuario} gestion={false} global={this.props.global} />;
              } else {
                this.HandleAutenticarClick();
              }
            }}
          />
        </div>
      </Header>
    );
  }
}
//#endregion

//#region Exports
export default ComponentHeader;
//#endregion
