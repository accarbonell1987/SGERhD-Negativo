//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentInputDatePicker from "../generales/ComponentInputDatePicker";
//#endregion

//#region Definicion Clase
class ComponentAddPregnancy extends Component {
	//#region Properties
	state = {
		openModal: false,
		fecha: null,
		observaciones: "",
		examenes: [],
		tipo: "nuevo",
		semanas: 0,
		dias: 0,
		findeembarazo: "parto", //parto o aborto
		findeparto: "natural", //natural o cesarea
		findeaborto: "interrumpido", //natural o interrumpido
		paciente: null,
		activo: true,
		opcionPacientes: [],
		errortiempogestacion: false,
		errorform: false,
	};
	//#endregion

	//#region Constructor
	constructor(props) {
		super(props);

		this.setDate = this.setDate.bind(this);
		this.addPregnancy = this.addPregnancy.bind(this);
		this.changeModalInput = this.changeModalInput.bind(this);
		this.changeModalState = this.changeModalState.bind(this);
		this.clearModalState = this.clearModalState.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	//#endregion

	//#region Metodos y Eventos
	//componente se monto
	componentDidMount() {
		this.clearModalState();
	}
	//adicionar nuevo paciente
	addPregnancy = async () => {
		let { fecha, observaciones, examenes, tipo, semanas, dias, findeembarazo, findeaborto, findeparto, paciente, activo } = this.state;
		//limpiar segun el tip de embarazo
		if (tipo === "nuevo") {
			findeembarazo = null;
			findeaborto = null;
			findeparto = null;
		} else {
			semanas = 0;
			dias = 0;
		}

		const pregnancy = {
			fecha: fecha,
			observaciones: observaciones,
			examenes: examenes,
			tipo: tipo,
			semanas: semanas,
			dias: dias,
			findeembarazo: findeembarazo,
			findeaborto: findeaborto,
			findeparto: findeparto,
			paciente: paciente,
			activo: activo,
		};
		//la promise debe de devolver un valor RETURN
		try {
			const res = await fetch(this.props.parentState.endpoint + "api/embarazo/", {
				method: "POST",
				body: JSON.stringify(pregnancy),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"access-token": this.props.parentState.token,
				},
			});
			let data = await res.json();
			//capturar respuesta
			const { status, message } = data;
			if (status === 200) {
				this.clearModalState();
				Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 3000 });
				return true;
			} else {
				Swal.fire({ position: "center", icon: "error", title: message, showConfirmButton: false, timer: 5000 });
				return false;
			}
		} catch (err) {
			Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 });
			return false;
		}
	};
	//validar el formulario
	handleSubmit = (evt) => {
		evt.preventDefault();

		const errortiempogestacion = this.state.tipo === "nuevo" ? (!(this.state.semanas > 0 || this.state.dias > 0) ? { content: "El tiempo de gestación no puede ser cero", pointing: "above" } : false) : false;
		// const errorfinembarazo = this.state.tipo === "antiguo" ? (this.state.findeembarazo === null ? { content: "Debe de seleccionar un tipo de fin de embarazo", pointing: "left" } : false) : false;
		// const errorparto = this.state.tipo === "antiguo" ? (this.state.findeembarazo === "parto" ? (this.state.findeparto === null ? { content: "Debe de seleccionar un criterio (natural / cesarea)", pointing: "above" } : false) : false) : false;
		// const erroraborto = this.state.tipo === "antiguo" ? (this.state.findeembarazo === "aborto" ? (this.state.findeaborto === null ? { content: "Debe de seleccionar un criterio (natural / interrumpido)", pointing: "above" } : false) : false) : false;

		let etiempogestacion = Boolean(errortiempogestacion);
		// let efinembarazo = Boolean(errorfinembarazo);
		// let eparto = Boolean(errorparto);
		// let eaborto = Boolean(erroraborto);

		let errform = etiempogestacion;

		this.setState({
			errortiempogestacion: errortiempogestacion,
			errorform: errform,
		});

		return errform;
	};
	//Actualiza los inputs con los valores que vamos escribiendo
	changeModalInput = (evt) => {
		const { name, value } = evt.target;

		this.setState({
			[name]: value,
		});
	};
	//cambiar el estado en el MODAL para adicionar
	changeModalState = async (evt) => {
		if (evt.target.className.includes("modal-button-add") || evt.target.className.includes("modal-icon-add")) {
			this.clearModalState();
			this.setState({ openModal: true });
		} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		} else {
			//si no hay problemas en el formulario
			if (this.handleSubmit(evt) === false) {
				//si no hay problemas en la insercion
				if (await this.addPregnancy()) {
					//enviar a recargar los pacientes
					this.props.reloadFromServer();
					this.clearModalState();
				}
			}
		}
	};
	//limpiar states
	clearModalState = () => {
		let opcion = [];
		this.props.pacientes.forEach((p) => {
			let nombreyapellidos = p.nombre + " " + p.apellidos;
			let cur = { key: p._id, text: nombreyapellidos, value: p._id, icon: "wheelchair" };
			opcion = [...opcion, cur];
		});

		const paciente = this.props.paciente != null ? this.props.paciente : null;
		//actualizar los states
		this.setState({
			openModal: false,
			fecha: null,
			observaciones: "",
			examenes: [],
			tipo: "nuevo",
			semanas: 0,
			dias: 0,
			findeembarazo: "parto", //parto o aborto
			findeparto: "natural", //natural o cesarea
			findeaborto: "interrumpido", //natural o interrumpido
			activo: true,
			paciente: paciente,
			opcionPacientes: opcion,
			errortiempogestacion: false,
			errorform: false,
		});
	};
	//capturar fecha
	setDate = (fecha) => {
		//calcular el dia de la semana
		const ahora = moment();
		const fechaSeleccionada = moment(fecha);
		const calculardiferenciasemanas = ahora.format("w") - fechaSeleccionada.format("w");

		//diferencias de dias
		let difdias = ahora.diff(fechaSeleccionada, "days");

		let dias = 0;
		let stop = false;
		while (!stop) {
			//si los dias menos siete da resto cero
			if ((difdias - dias) % 7 === 0) stop = true;
			else dias++;
		}

		const semana = calculardiferenciasemanas > 0 ? calculardiferenciasemanas : 0;
		this.setState({
			fecha: fecha,
			semanas: semana,
			dias: dias,
		});
	};
	changeIconInAddButton = (change) => {
		const position = this.props.middleButtonAdd ? "middle" : "right";
		if (change)
			return (
				<Button icon floated={position} labelPosition="right" className="modal-button-add" onClick={this.changeModalState}>
					<Icon name="add circle" className="modal-icon-add" onClick={this.changeModalState} />
					Adicionar
				</Button>
			);
		else
			return (
				<Button icon floated={position} labelPosition="left" primary size="small" onClick={this.changeModalState} className="modal-button-add">
					<Icon name="add circle" className="modal-icon-add" />
					Adicionar
				</Button>
			);
	};
	choseEndOfPregnancy = () => {
		if (this.state.findeembarazo === "parto") {
			return (
				<Form.Group inline>
					<Form.Radio
						name="radiopartonatural"
						labelPosition="right"
						label="Natural"
						checked={this.state.findeparto === "natural"}
						value={this.state.findeparto}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								findeparto: "natural",
							});
						}}
					/>
					<Form.Radio
						name="radiopartocesarea"
						labelPosition="right"
						label="Cesarea"
						checked={this.state.findeparto === "cesarea"}
						value={this.state.findeparto}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								findeparto: "cesarea",
							});
						}}
					/>
				</Form.Group>
			);
		} else if (this.state.findeembarazo === "aborto") {
			return (
				<Form.Group inline>
					<Form.Radio
						name="radioabortonatural"
						labelPosition="right"
						label="Natural"
						checked={this.state.findeaborto === "natural"}
						value={this.state.findeaborto}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								findeaborto: "natural",
							});
						}}
					/>
					<Form.Radio
						name="radioabortointerrumpido"
						labelPosition="right"
						label="Interrumpido"
						checked={this.state.findeaborto === "interrumpido"}
						value={this.state.findeaborto}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								findeaborto: "interrumpido",
							});
						}}
					/>
				</Form.Group>
			);
		}
	};
	choseType = () => {
		if (this.state.tipo === "nuevo") {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Tiempo de Gestación:</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Form.Group>
								<Form.Input className="modal-input-100p" required name="semanas" icon="calendar alternate outline" iconPosition="left" label="Semanas:" value={this.state.semanas} error={this.state.errortiempogestacion} />
								<Button.Group>
									<Button
										className="button-group-addsub"
										icon="plus"
										primary
										onClick={(evt) => {
											evt.preventDefault();
											this.setState({
												semanas: this.state.semanas + 1,
											});
										}}
									/>
									<Button
										className="button-group-addsub"
										icon="minus"
										secondary
										disabled={this.state.semanas === 0}
										onClick={(evt) => {
											evt.preventDefault();
											this.setState({
												semanas: this.state.semanas - 1,
											});
										}}
									/>
								</Button.Group>
							</Form.Group>
						</Segment>
						<Segment>
							<Form.Group>
								<Form.Input className="modal-input-100p" required name="dias" icon="calendar alternate" iconPosition="left" label="Dias:" value={this.state.dias} error={this.state.errortiempogestacion} />
								<Button.Group>
									<Button
										className="button-group-addsub"
										icon="plus"
										primary
										onClick={(evt) => {
											evt.preventDefault();
											this.setState({
												dias: this.state.dias + 1,
											});
										}}
									/>
									<Button
										className="button-group-addsub"
										icon="minus"
										secondary
										disabled={this.state.dias === 0}
										onClick={(evt) => {
											evt.preventDefault();
											this.setState({
												dias: this.state.dias - 1,
											});
										}}
									/>
								</Button.Group>
							</Form.Group>
						</Segment>
					</Segment.Group>
				</Segment.Group>
			);
		} else {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment.Group horizontal>
						<Segment className="modal-segment-expanded-grouping">
							<Form.Group inline>
								<Header as="h5" className="header-custom">
									Fin de Embarazo:
								</Header>
								<Form.Radio
									name="radioparto"
									labelPosition="right"
									label="Parto"
									checked={this.state.findeembarazo === "parto"}
									value={this.state.findeembarazo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											findeembarazo: "parto",
										});
									}}
								/>
								<Form.Radio
									name="radioaborto"
									labelPosition="right"
									label="Aborto"
									checked={this.state.findeembarazo === "aborto"}
									value={this.state.findeembarazo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											findeembarazo: "aborto",
										});
									}}
								/>
							</Form.Group>
							<Segment>{this.choseEndOfPregnancy()}</Segment>
						</Segment>
					</Segment.Group>
				</Segment.Group>
			);
		}
	};
	//#endregion

	//#region Render
	render() {
		return (
			<Modal open={this.state.openModal} trigger={this.changeIconInAddButton(this.props.cambiarIcono)}>
				<Header icon="heartbeat" content="Adicionar Embarazo" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.changeModalState}>
						<Form.Group>
							<Segment className="modal-segment-expanded">
								<Header as="h5">Fecha de Concepción:</Header>
								<ComponentInputDatePicker setDate={this.setDate} />
							</Segment>
						</Form.Group>
						<Form.TextArea name="observaciones" label="Observaciones:" placeholder="Observaciones..." value={this.state.observaciones} onChange={this.changeModalInput} />
						<Segment className="modal-segment-expanded-grouping">
							<Form.Group inline>
								<Header as="h5" className="header-custom">
									Tipo de Embarazo:
								</Header>
								<Form.Radio
									name="radionuevo"
									labelPosition="right"
									label="Nuevo"
									checked={this.state.tipo === "nuevo"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "nuevo",
										});
									}}
								/>
								<Form.Radio
									name="radioantiguo"
									labelPosition="right"
									label="Antiguo"
									checked={this.state.tipo === "antiguo"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "antiguo",
											semanas: 0,
											dias: 0,
										});
									}}
								/>
							</Form.Group>
						</Segment>
						<Form.Group>{this.choseType()}</Form.Group>
						<Form.Select
							name="paciente"
							label="Paciente:"
							placeholder="Seleccionar Paciente"
							options={this.state.opcionPacientes}
							value={this.state.paciente ? this.state.paciente._id : null}
							onChange={(e, { value }) => {
								this.setState({ paciente: value });
							}}
							fluid
							selection
							clearable
						/>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.changeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.changeModalState} className="modal-button-accept" type="submit" disabled={!this.state.fecha || !this.state.paciente}>
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
export default ComponentAddPregnancy;
//#endregion
