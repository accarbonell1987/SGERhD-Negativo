//Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Image, Checkbox } from "semantic-ui-react";
import Swal from "sweetalert2";

//CSS
import "../global/css/Gestionar.css";

//Componentes
import ComponentAddUser from "./ComponentAddUser";
import ComponentUpdateUser from "./ComponentUpdateUser";
import ComponentChangePassword from "./ComponentChangePassword";

//Defincion de la clase
class ComponentUsers extends Component {
  constructor(props) {
    super(props);

    this.DeleteUser = this.DeleteUser.bind(this);
  }
  //eliminar el usuario
  DeleteUser = (usuario) => {
    //chequear que las cookies tengan los datos necesarios
    const data = this.props.global.cookies();
    if (!data) this.props.Deslogin();

    //Esta seguro?
    let { text, accion } = "";
    if (usuario.activo) accion = "Desactivar";
    else accion = "Eliminar";
    text = "Desea " + accion + " el usuario: " + usuario.nombre;

    Swal.fire({
      title: "¿Esta seguro?",
      text: text,
      icon: "question",
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      cancelButtonColor: "#db2828",
      confirmButtonColor: "#21ba45",
      // cancelButtonColor: '#d33',
      confirmButtonText: "Si, " + accion,
      reverseButtons: true,
    }).then((result) => {
      //si escogio Si
      if (result.value) {
        //enviar al endpoint
        fetch(this.props.global.endpoint + "api/usuario/" + usuario._id, {
          method: "PUT",
          body: JSON.stringify(usuario),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "access-token": data.token,
          },
        })
          .then((res) => res.json())
          .then((serverdata) => {
            const { status, message } = serverdata;
            status === 200
              ? Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 3000 })
              : Swal.fire({ position: "center", icon: "error", title: message, showConfirmButton: false, timer: 5000 });
            //Actualizar el listado
            this.props.GetDataFromServer();
          })
          .catch((err) => {
            Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 }); //mostrar mensaje de error
          });
      }
    });
  };
  CheckAndAllowAddButton = (middleButtonAdd, allow) => {
    if (allow)
      return <ComponentAddUser middleButtonAdd={middleButtonAdd} Deslogin={this.props.Deslogin} global={this.props.global} GetDataFromServer={this.props.GetDataFromServer} />;
    else
      return (
        <Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
          <Icon name="add user" />
          Adicionar
        </Button>
      );
  };

  render() {
    const data = this.props.global.cookies();
    //buscar el permiso del rol
    const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
    //buscar el acceso del menu
    const accesomenu = permiso.accesos.find((p) => p.opcion === "usuarios");
    //chequear si es usuario y tengo permiso
    return (
      <Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
        <Grid.Column className="gestionar-allcolumn">
          <Label attached="top left" className="div-label-attached" size="large">
            <Icon name="users" size="large" inverted /> Gestión de Usuarios
          </Label>
          <Table compact celled definition attached="top" className="div-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="6">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
              </Table.Row>
              {this.props.usuarios.length > 0 ? (
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Nombre</Table.HeaderCell>
                  <Table.HeaderCell>Correo Electrónico</Table.HeaderCell>
                  <Table.HeaderCell>Rol</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Logs</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
                  <Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
                </Table.Row>
              ) : (
                ""
              )}
            </Table.Header>

            <Table.Body>
              {this.props.usuarios.map((usuario) => {
                let rolData = this.props.global.roles.find((element) => {
                  return element.key === usuario.rol;
                });
                //para colorear row
                let negative = data.usuario === usuario.nombre || usuario.nombre === "administrador";
                return (
                  <Table.Row key={usuario._id} negative={negative}>
                    <Table.Cell collapsing>
                      <Icon name="user" />
                    </Table.Cell>
                    <Table.Cell>{usuario.nombre}</Table.Cell>
                    <Table.Cell>{usuario.email}</Table.Cell>
                    <Table.Cell>
                      <Label image size="medium">
                        <Image src={rolData.image.src} />
                        {rolData.text}
                      </Label>
                    </Table.Cell>
                    <Table.Cell className="cell-logs" collapsing>
                      <Button icon labelPosition="right" className="button-logs">
                        <Icon name="address card outline" className="button-icon-logs" />
                        Logs
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="cells-max-witdh-2" collapsing>
                      <Checkbox toggle name="activo" labelPosition="left" label={usuario.activo ? "Si" : "No"} checked={usuario.activo} disabled />
                    </Table.Cell>
                    <Table.Cell className="cell-acciones" collapsing>
                      {
                        //acceso a eliminar
                        accesomenu.permisos.eliminar && !negative ? (
                          <Button icon="remove user" className="button-remove" onClick={() => this.DeleteUser(usuario)} />
                        ) : (
                          <Button icon="remove user" className="button-remove" disabled />
                        )
                      }
                      {accesomenu.permisos.modificar ? (
                        <ComponentUpdateUser usuario={usuario} Deslogin={this.props.Deslogin} global={this.props.global} GetDataFromServer={this.props.GetDataFromServer} />
                      ) : (
                        <Button icon="edit" disabled />
                      )}
                      {this.props.global.rol === "informatico" ? (
                        <ComponentChangePassword usuario={usuario} gestion={true} global={this.props.global} />
                      ) : (
                        <Button icon="key" disabled />
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ComponentUsers;
