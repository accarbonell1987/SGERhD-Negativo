//#region Importaciones
import React, { Component } from "react";
import { Button, Modal, Icon, Header } from "semantic-ui-react";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentTests from "./ComponentTests";
//#endregion

//#region Defincion de la clase
class ComponentModalTest extends Component {
	state = {
		openModal: false,
	};

	componentDidMount = () => {
		this.ClearModalState();
	};
	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	//#region Metodos y Eventos
	ChangeModalState = async (evt, allow) => {
		if (allow) {
			if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
				this.ClearModalState();
				this.setState({ openModal: true });
			} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
				this.setState({ openModal: false });
			}
		}
	};
	ClearModalState = () => {
		this.setState({ openModal: false });
	};
	ChangeIconInAddButton = (allow, change) => {
		const position = this.props.middleButtonAdd ? "middle" : "right";
		const cantExamenes = this.props.examenes ? this.props.examenes.length : 0;
		const permitir = allow;
		if (change)
			return (
				<Button
					disabled={!permitir}
					icon
					floated={position}
					labelPosition="right"
					className="modal-button-add"
					primary
					onClick={(evt) => {
						this.ChangeModalState(evt, permitir);
					}}
				>
					<Icon
						name="clipboard list"
						className="modal-icon-add"
						onClick={(evt) => {
							this.ChangeModalState(evt, permitir);
						}}
					/>
					{cantExamenes}
				</Button>
			);
		else
			return (
				<Button
					disabled={!permitir}
					floated="right"
					icon
					labelPosition="left"
					primary
					size="small"
					onClick={(evt) => {
						this.ChangeModalState(evt, permitir);
					}}
					className="modal-button-add"
				>
					<Icon
						name="clipboard list"
						className="modal-icon-add"
						onClick={(evt) => {
							this.ChangeModalState(evt, permitir);
						}}
					/>
					{cantExamenes}
				</Button>
			);
	};
	//#endregion

	//#region Render
	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "examenes");
		const headerlabel = "Listado de Examenes: ";
		//chequear si es embarazos y tengo permiso

		//donde almacenar las pruebas
		var pruebas = [];
		//las pruebas de los embarazos
		this.props.embarazos.forEach((embarazo) => {
			return embarazo.examenes.forEach((examen) => (pruebas = [...pruebas, examen.pruebas]));
		});
		//las pruebas de los examenes
		this.props.examenes.forEach((examen) => (pruebas = [...pruebas, examen.pruebas]));

		return (
			<Modal className="modal-windows-pregnancies" open={this.state.openModal} trigger={this.ChangeIconInAddButton(accesomenu.permisos.menu, this.props.cambiarIcono)}>
				<Header icon="clipboard list" content={headerlabel} />
				<Modal.Content>
					<ComponentTests Deslogin={this.props.Deslogin} middleButtonAdd={true} global={this.props.global} pacientes={this.props.pacientes} embarazos={this.props.embarazos} examenes={this.props.examenes} pruebas={pruebas} GetDataFromServer={this.props.GetDataFromServer} detail={true} paciente={this.props.paciente} embarazo={this.props.embarazo} />
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
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
export default ComponentModalTest;
//#endregion
