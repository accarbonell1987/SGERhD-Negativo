//#region Importaciones
import React, { Component } from "react";
import { Header, Form, Segment, Modal, Message, Icon, Button } from "semantic-ui-react";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
//#endregion

//#region Definicion Clase
class ComponentGrupoSanguineo extends Component {
	//#region Properties
	state = {
		dDebil: "",
		gSanguineo: "",
		factor: "",
		analisis: null,
		opcionGrupoSanguineo: null,
		errorform: false,
	};

	gruposanguineo = [
		{ key: "A", text: "A", value: "A", icon: "tint" },
		{ key: "B", text: "B", value: "B", icon: "tint" },
		{ key: "AB", text: "AB", value: "AB", icon: "tint" },
		{ key: "A2B", text: "A2B", value: "A2B", icon: "tint" },
		{ key: "O", text: "O", value: "O", icon: "tint" },
	];
	//#endregion

	//#region Metodos y Eventos
	//componente se monto
	componentDidMount() {
		this.ClearModalState();
	}
	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	//validar el formulario
	HandleSubmit = (evt) => {
		evt.preventDefault();
		return false;
	};
	//cambiar el estado en el MODAL para adicionar
	ChangeModalState = async (evt) => {
		if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
			this.ClearModalState();
			this.setState({ openModal: true });
		} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		} else {
			this.OnSubmit(evt);
		}
	};
	//Actualiza los inputs con los valores que vamos escribiendo
	ChangeModalInput = (evt) => {
		const { name, value } = evt.target;

		this.setState({
			[name]: value,
		});
	};
	ChangeIconInButton = (change) => {
		const position = this.props.middleButtonAdd ? "middle" : "right";
		if (change)
			return (
				<Button icon floated={position} labelPosition="right" className="modal-button-add" onClick={this.ChangeModalState}>
					<Icon name="checkmark" className="modal-icon-add" onClick={this.ChangeModalState} />
					Adicionar
				</Button>
			);
		else
			return (
				<Button icon floated={position} labelPosition="left" primary size="small" onClick={this.ChangeModalState} className="modal-button-add">
					<Icon name="checkmark" className="modal-icon-add" />
					Adicionar
				</Button>
			);
	};
	//al presionar la tecla de ENTER
	OnPressEnter = (evt) => {
		const disabled = !this.state.fecha || !this.state.paciente;
		if (evt.keyCode === 13 && !evt.shiftKey && !disabled) {
			evt.preventDefault();
			this.props.OnSubmit(evt);
		}
	};
	//limpiar states
	ClearModalState = () => {
		let opcionGrupoSanguineo = [];
		this.gruposanguineo.forEach((cur) => {
			opcionGrupoSanguineo = [...opcionGrupoSanguineo, cur];
		});

		const gruposanguineo = this.props.analisis != null ? this.props.analisis.gruposanguineo : null;
		const analisis = this.props.analisis != null ? this.props.analisis._id : null;

		//actualizar los states
		this.setState({
			dDebil: "",
			gSanguineo: gruposanguineo,
			factor: "",
			analisis: analisis,
			opcionGrupoSanguineo: opcionGrupoSanguineo,
			errorform: false,
		});
	};
	//#endregion

	//#region Render
	render() {
		return (
			<Modal open={this.state.openModal} trigger={this.ChangeIconButton(this.props.cambiarIcono)}>
				<Header icon="syringe" content="Resultados de Análisis" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Segment.Group>
							<div className="div-select">
								<Form.Select
									name="grupo"
									label="Grupo:"
									placeholder="Seleccionar Grupo Sanguineo"
									options={this.state.opcionGrupoSanguineo}
									value={this.state.gSanguineo}
									onChange={(e, { value }) => {
										this.setState({ gSanguineo: value });
									}}
									fluid
									selection
									clearable
								/>
							</div>
							<Segment className="modal-segment-expanded-grouping">
								<Form.Group inline>
									<Header as="h5" className="header-custom">
										Factor:
									</Header>
									<Form.Radio
										name="radiofactorpositivo"
										labelPosition="right"
										label="Positivo (+)"
										checked={this.state.factor === "Positivo (+)"}
										value={this.state.factor}
										onChange={(evt) => {
											evt.preventDefault();
											this.setState({
												factor: "Positivo (+)",
											});
										}}
									/>
									<Form.Radio
										name="radiofactornegativo"
										labelPosition="right"
										label="Negativo (-)"
										checked={this.state.factor === "Negativo (-)"}
										value={this.state.factor}
										onChange={(evt) => {
											evt.preventDefault();
											this.setState({
												factor: "Negativo (-)",
											});
										}}
									/>
								</Form.Group>
							</Segment>
							<Segment className="modal-segment-expanded-grouping">
								<Form.Group inline>
									<Header as="h5" className="header-custom">
										D-Debil:
									</Header>
									<Form.Radio
										name="radioddebil"
										labelPosition="right"
										label="D-Debil"
										checked={this.state.dDebil === "D-Debil"}
										value={this.state.dDebil}
										onChange={(evt) => {
											evt.preventDefault();
											this.setState({
												dDebil: "D-Debil",
											});
										}}
									/>
									<Form.Radio
										name="radionegativo"
										labelPosition="right"
										label="Negativo"
										checked={this.state.dDebil === "Negativo"}
										value={this.state.dDebil}
										onChange={(evt) => {
											evt.preventDefault();
											this.setState({
												dDebil: "Negativo",
											});
										}}
									/>
								</Form.Group>
							</Segment>
						</Segment.Group>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.fecha || !this.state.paciente}>
						<Icon name="checkmark" className="modal-icon-accept" />
						Aceptar
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
	//#endregion
}
//#endregion

//#region Exports
export default ComponentGrupoSanguineo;
//#endregion
