//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Segment, Label } from "semantic-ui-react";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentAddClinicHistory from "./ComponentAddClinicHistory";
//#endregion

//#region Definicion de Clase
class ComponentSeeClinicHistory extends Component {
	state = {
		openModal: false,
		opcionPacientes: [],
	};

	generos = [
		{ key: "M", text: "Masculino", value: "M", icon: "man" },
		{ key: "F", text: "Femenino", value: "F", icon: "woman" },
	];

	//constructor
	constructor(props) {
		super(props);

		this.ClearModalState = this.ClearModalState.bind(this);
		this.ChangeModalInput = this.ChangeModalInput.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.HandleSubmit = this.HandleSubmit.bind(this);
	}

	//validar el formulario
	HandleSubmit = (evt) => {
		evt.preventDefault();
		return false;
	};
	//Actualiza los inputs con los valores que vamos escribiendo
	ChangeModalInput = (evt) => {
		const { name, value } = evt.target;

		this.setState({
			[name]: value,
		});
	};
	//cambiar el estado en el MODAL para adicionar usuario
	ChangeModalState = async (evt) => {
		if (evt.target.className.includes("button-childs") || evt.target.className.includes("button-icon-childs")) {
			this.ClearModalState();
			this.setState({
				openModal: true,
			});
		} else if (evt.target.className.includes("modal-button-cancel")) {
			this.ClearModalState();
		} else {
			this.ClearModalState();
		}
	};
	//limpiar states
	ClearModalState = () => {
		let opcion = [];

		let nombreyapellidos = this.props.paciente.nombre + " " + this.props.paciente.apellidos;
		let cur = {
			key: this.props.paciente._id,
			text: nombreyapellidos,
			value: this.props.paciente._id,
			icon: "wheelchair",
		};
		opcion = [...opcion, cur];

		this.setState({
			openModal: false,
			opcionPacientes: opcion,
		});
	};
	//obtener la clasificacion de embarazo segun varios criterios
	GetClasification = (numeropartos, numeroabortos, numeroembarazos) => {
		let clasificacion = "";
		//nulipara, primigesta, nulipara y primigesta, multipara
		if (numeroabortos === 0 && numeropartos === 0 && numeroembarazos === 1) {
			clasificacion = "Primigesta";
		} else if (numeroabortos > 0 && numeropartos === 0 && numeroembarazos > 0) {
			clasificacion = "Nulipara";
		} else if (numeropartos > 1) {
			clasificacion = "Multipara";
		} else {
			clasificacion = "Sin clasificacion";
		}
		return clasificacion;
	};
	ChoseWhenVaccum = (historia, numeropartos, numeroabortos) => {
		if (historia.vacunaAntiD && (numeropartos > 0 || numeroabortos > 0)) {
			return (
				<Segment className="modal-segment-expanded">
					<Form.Group inline>
						<Header as="h5" className="header-custom">
							¿Cuando se Administró la Vacuna?:
						</Header>
						<Form.Radio name="radioantes" labelPosition="right" label="Antes del Parto" checked={historia.administracionVacuna === "Antes del Parto"} value={historia.administracionVacuna} />
						<Form.Radio name="radiodespues" labelPosition="right" label="Después del Parto" checked={historia.administracionVacuna === "Después del Parto"} value={historia.administracionVacuna} />
					</Form.Group>
				</Segment>
			);
		}
	};

	render() {
		const historia = this.props.paciente.historiaclinica;
		//buscar el permiso del rol
		if (historia != null) {
			let classNameToButton = !historia.activo ? "button-childs button-disable" : "button-childs";

			let numeropartos = historia.numeroDePartos + this.props.paciente.embarazos.filter((e) => e.findeembarazo === "Parto").length;
			let numeroabortos = historia.numeroDeAbortos + this.props.paciente.embarazos.filter((e) => e.findeembarazo === "Aborto").length;
			let numeroembarazos = historia.numeroDeEmbarazos + this.props.paciente.embarazos.length;

			return (
				<Modal
					open={this.state.openModal}
					trigger={
						<Button icon labelPosition="right" className={classNameToButton} onClick={this.ChangeModalState}>
							<Icon name="eye" className="button-icon-childs" onClick={this.ChangeModalState} />
							{historia.numerohistoria}
						</Button>
					}
				>
					<Header icon="clipboard" content="Detalles Historia Clinica" />
					<Modal.Content>
						<Form ref="form">
							<Form.Input name="numerohistoria" icon="address card outline" iconPosition="left" label="Numero de Historia:" value={historia.numerohistoria} />
							<Segment.Group horizontal className="modal-segment-group">
								<Segment className="modal-segment-longleft">
									<Form.Input name="areaDeSalud" icon="hospital symbol" iconPosition="left" label="Area de Salud:" value={historia.areaDeSalud} placeholder="Consultorio, Policlinico, Hospital" />
								</Segment>
								<Segment className="modal-segment-shortright">
									<Form.Group>
										<Segment className="modal-segment-expanded">
											<Header as="h5">Vacuna Anti-D:</Header>
											<Form.Checkbox toggle name="vacunaAntiD" labelPosition="left" checked={historia.vacunaAntiD} label={historia.vacunaAntiD === true ? "Si" : "No"} value={historia.vacunaAntiD} readOnly />
										</Segment>
									</Form.Group>
								</Segment>
							</Segment.Group>
							<Form.Group>{this.ChoseWhenVaccum(historia, numeropartos, numeroabortos)}</Form.Group>
							<Segment.Group horizontal>
								<Segment>
									<Form.Group>
										<Form.Input className="modal-input-100p" name="numeroDeEmbarazos" icon="user md" iconPosition="left" label="Numero de Embarazos:" value={numeroembarazos} />
									</Form.Group>
								</Segment>
								<Segment>
									<Form.Group>
										<Form.Input className="modal-input-100p" name="numeroDePartos" icon="user md" iconPosition="left" label="Numero de Partos:" value={numeropartos} />
									</Form.Group>
								</Segment>
								<Segment>
									<Form.Group>
										<Form.Input className="modal-input-100p" name="numeroDeAbortos" icon="user md" iconPosition="left" label="Numero de Abortos:" value={numeroabortos} />
									</Form.Group>
								</Segment>
							</Segment.Group>
							<Form.Group>
								<Segment className="modal-segment-expanded">
									<Header as="h5">Clasificacion:</Header>
									<Label size="large">{this.GetClasification(numeropartos, numeroabortos, numeroembarazos)}</Label>
								</Segment>
							</Form.Group>
							<Form.Select name="paciente" label="Paciente:" placeholder="Seleccionar Paciente" options={this.state.opcionPacientes} value={this.props.paciente._id} fluid selection />
							<Form.Group>
								<Segment className="modal-segment-expanded">
									<Header as="h5">Activo:</Header>
									<Form.Checkbox toggle name="activo" labelPosition="left" label={historia.activo === true ? "Si" : "No"} value={historia.activo} checked={historia.activo} />
								</Segment>
							</Form.Group>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
							<Icon name="remove" /> Cancelar
						</Button>
					</Modal.Actions>
				</Modal>
			);
		} else return <ComponentAddClinicHistory Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} global={this.props.global} pacientes={this.props.pacientes} historiasclinicas={this.props.historiasclinicas} cambiarIcono={true} paciente={this.props.paciente} />;
	}
}
//#endregion

//#region Exports
export default ComponentSeeClinicHistory;
//#endregion
