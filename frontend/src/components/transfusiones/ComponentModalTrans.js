//#region Importaciones
import React, { Component } from "react";
import { Button, Modal, Icon, Header } from "semantic-ui-react";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentTrans from "./ComponentTrans";
//#endregion

//#region Defincion de la clase
class ComponentModalTrans extends Component {
	state = {
		openModal: false,
	};

	componentDidMount = () => {
		this.clearModalState();
	};

	//#region Metodos y Eventos
	changeModalState = async (evt) => {
		if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add") || evt.target.className.includes("button-childs") || evt.target.className.includes("button-icon-childs")) {
			this.clearModalState();
			this.setState({ openModal: true });
		} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		}
	};
	clearModalState = () => {
		this.setState({ openModal: false });
	};
	//#endregion

	//#region Render
	render() {
		//buscar el permiso del rol
		const permiso = this.props.permisos.find((p) => p.rol === this.props.parentState.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "transfusiones");
		const headerlabel = "Listado de Transfusiones De: " + this.props.paciente.nombre + " " + this.props.paciente.apellidos;
		//chequear si es transfusiones y tengo permiso
		return (
			<Modal
				open={this.state.openModal}
				trigger={
					accesomenu.permisos.menu ? (
						this.props.cambiarIcono ? (
							<Button icon labelPosition="right" primary className="button-childs" onClick={this.changeModalState}>
								<Icon name="tint" className="button-icon-childs" onClick={this.changeModalState} />
								{this.props.transfusiones ? this.props.transfusiones.length : 0}
							</Button>
						) : (
							<Button floated="right" icon labelPosition="left" primary size="small" onClick={this.changeModalState} className="modal-button-add">
								<Icon name="tint" className="modal-icon-add" />
								{this.props.transfusiones ? this.props.transfusiones.length : 0}
							</Button>
						)
					) : this.props.cambiarIcono ? (
						<Button disabled icon labelPosition="right" primary className="button-childs">
							<Icon name="tint" className="button-icon-childs" />
							{this.props.transfusiones ? this.props.transfusiones.length : 0}
						</Button>
					) : (
						<Button disabled floated="right" icon labelPosition="left" primary size="small" className="modal-button-add">
							<Icon name="tint" className="modal-icon-add" />
							{this.props.transfusiones ? this.props.transfusiones.length : 0}
						</Button>
					)
				}
			>
				<Header icon="wheelchair" content={headerlabel} />
				<Modal.Content>
					<ComponentTrans parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} pacientes={this.props.pacientes} transfusiones={this.props.transfusiones} reloadFromServer={this.props.reloadFromServer} detail={true} paciente={this.props.paciente} />
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.changeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cerrar
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
	//#endregion
}
//#endregion

//#region Export
export default ComponentModalTrans;
//#endregion
