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
	changeModalState = async (evt, allow) => {
		if (allow) {
			if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
				this.clearModalState();
				this.setState({ openModal: true });
			} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
				this.setState({ openModal: false });
			}
		}
	};
	clearModalState = () => {
		this.setState({ openModal: false });
	};
	changeIconInAddButton = (allow, change) => {
		console.log("allow -> " + allow, ", change ->" + change);
		const position = this.props.middleButtonAdd ? "middle" : "right";
		const cantTransfusiones = this.props.transfusiones ? this.props.transfusiones.length : 0;
		if (change)
			return (
				<Button
					disabled={!allow}
					icon
					floated={position}
					labelPosition="right"
					className="modal-button-add"
					primary
					onClick={(evt) => {
						this.changeModalState(evt, allow);
					}}
				>
					<Icon
						name="tint"
						className="modal-icon-add"
						onClick={(evt) => {
							this.changeModalState(evt, allow);
						}}
					/>
					{cantTransfusiones}
				</Button>
			);
		else
			return (
				<Button
					disabled={!allow}
					floated="right"
					icon
					labelPosition="left"
					primary
					size="small"
					onClick={(evt) => {
						this.changeModalState(evt, allow);
					}}
					className="modal-button-add"
				>
					<Icon
						name="tint"
						className="modal-icon-add"
						onClick={(evt) => {
							this.changeModalState(evt, allow);
						}}
					/>
					{cantTransfusiones}
				</Button>
			);
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
			<Modal open={this.state.openModal} trigger={this.changeIconInAddButton(accesomenu.permisos.menu, this.props.cambiarIcono)}>
				<Header icon="wheelchair" content={headerlabel} />
				<Modal.Content>
					<ComponentTrans middleButtonAdd={true} parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} pacientes={this.props.pacientes} transfusiones={this.props.transfusiones} reloadFromServer={this.props.reloadFromServer} detail={true} paciente={this.props.paciente} />
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
