//Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Image } from "semantic-ui-react";

//CSS
import "./global/css/Header.css";

//Definicion de la Clase
class ComponentHeader extends Component {
  constructor(props) {
    super(props);

    this.handleAutenticarClick = this.handleAutenticarClick.bind(this);
  }

  handleAutenticarClick = () => {
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
          <Button as="a" inverted animated="right" size="mini" onClick={this.handleAutenticarClick}>
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

export default ComponentHeader;
