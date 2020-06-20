//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Image } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "./global/css/Header.css";
//#endregion

//#region Definicion de la Clase
class ComponentHeader extends Component {
  constructor(props) {
    super(props);

    this.HandleAutenticarClick = this.HandleAutenticarClick.bind(this);
  }

  //componenten mixin
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
          <Button as="a" inverted animated="right" size="mini" onClick={this.HandleAutenticarClick}>
            <Button.Content visible>
              <Icon name="user" />
              {data.usuario} - {data.rol}
            </Button.Content>
            <Button.Content hidden>
              <Icon name="log out" />
              Deslogear
            </Button.Content>
          </Button>
        </div>
      </Header>
    );
  }
}
//#endregion

//#region Exports
export default ComponentHeader;
//#endregion
