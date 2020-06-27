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
class ComponentAddPruebas extends Component {
	//#region Properties
	state = {
		openModal: false,
		fecha: null,
		tipo: "Grupos Sanguineo",
		examen: null,
		grupoSanguineo: null,
		identificacionAnticuerpo: null,
		pesquizajeAnticuerpo: null,
		pendiente: true,
		numeroMuestra: "",
		semanas: 0,
		dias: 0,
		activo: true,
		opcionExamenes: [],
		errorform: false,
	};
	//#endregion

	//#region Constructor
	constructor(props) {
		super(props);

		this.SetDate = this.SetDate.bind(this);
		this.AddPrueba = this.AddPrueba.bind(this);
		this.ChangeModalInput = this.ChangeModalInput.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.ClearModalState = this.ClearModalState.bind(this);
		this.HandleSubmit = this.HandleSubmit.bind(this);
		this.PregnancyAge = this.PregnancyAge.bind(this);
	}
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
	//adicionar nuevo paciente
	AddPrueba = async () => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			let { fecha, tipo, examen, grupoSanguineo, identificacionAnticuerpo, pesquizajeAnticuerpo, pendiente, numeroMuestra, semanas, dias, activo } = this.state;

			let tiempoDeGestacion = null;
			//estructura del ReaccionAdversaDetalle
			//reaccionAdversaDetalle = {fiebre, vomito, ...}
			const detalle = { semanas, dias };
			tiempoDeGestacion = JSON.stringify(detalle);

			const prueba = {
				fecha: fecha,
				tipo: tipo,
				examen: examen,
				grupoSanguineo: grupoSanguineo,
				identificacionAnticuerpo: identificacionAnticuerpo,
				pesquizajeAnticuerpo: pesquizajeAnticuerpo,
				pendiente: pendiente,
				numeroMuestra: numeroMuestra,
				tiempoDeGestacion: tiempoDeGestacion,
				activo: activo,
			};
			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/prueba/", {
					method: "POST",
					body: JSON.stringify(prueba),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"access-token": data.token,
					},
				});
				let serverdata = await res.json();
				//capturar respuesta
				const { status, message } = serverdata;
				if (status === 200) {
					this.ClearModalState();
					Swal.fire({
						position: "center",
						icon: "success",
						title: message,
						showConfirmButton: false,
						timer: 3000,
					});
					return true;
				} else {
					Swal.fire({
						position: "center",
						icon: "error",
						title: message,
						showConfirmButton: false,
						timer: 5000,
					});
					return false;
				}
			} catch (err) {
				Swal.fire({
					position: "center",
					icon: "error",
					title: err,
					showConfirmButton: false,
					timer: 5000,
				});
				return false;
			}
		}
	};
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
	//al presionar la tecla de ENTER
	OnPressEnter = (evt) => {
		const disabled = !this.state.fecha || !this.state.paciente;
		if (evt.keyCode === 13 && !evt.shiftKey && !disabled) {
			evt.preventDefault();
			this.OnSubmit(evt);
		}
	};
	//al enviar a aplicar el formulario
	OnSubmit = async (evt) => {
		//si no hay problemas en el formulario
		if (this.HandleSubmit(evt) === false) {
			//si no hay problemas en la insercion
			if (await this.AddPrueba()) {
				//enviar a recargar los pacientes
				this.props.GetDataFromServer();
				this.ClearModalState();
			}
		}
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
	//limpiar states
	ClearModalState = () => {
		let opcion = [];
		this.props.examenes.forEach((e) => {
			let fechacadena = moment(new Date(e.fecha)).format("DD-MM-YYYY");
			let datos = fechacadena + " - " + e.tipo;
			let cur = {
				key: e._id,
				text: datos,
				value: e._id,
				icon: "clipboard list",
			};
			opcion = [...opcion, cur];
		});

		const examen = this.props.examen != null ? this.props.examen._id : null;
		//actualizar los states
		this.setState({
			openModal: false,
			fecha: null,
			tipo: "Grupos Sanguineo",
			examen: examen,
			grupoSanguineo: null,
			identificacionAnticuerpo: null,
			pesquizajeAnticuerpo: null,
			pendiente: true,
			activo: true,
			opcionExamenes: opcion,
			errorform: false,
		});
	};
	//capturar fecha
	SetDate = (fecha) => {
		if (this.props.examen) {
			const fechaEmbarazo = this.props.examen.embarazo.fecha;
			//calcular el dia de la semana
			const ahora = moment();
			const fechaSeleccionada = moment(fechaEmbarazo);
			const calculardiferenciasemanas = moment(ahora - fechaSeleccionada).format("w");

			//diferencias de dias
			let difdias = ahora.diff(fechaSeleccionada, "days");

			let dias = 0;
			let stop = false;
			let diadesemana = 0;
			while (!stop) {
				//si los dias menos siete da resto cero
				diadesemana = difdias - dias;
				if (diadesemana % 7 === 0) stop = true;
				else dias++;
			}

			let semana = calculardiferenciasemanas > 0 ? calculardiferenciasemanas : 0;
			if (ahora.get("date") < diadesemana) semana--;
			this.setState({
				fecha: fecha,
				semanas: semana,
				dias: dias,
			});
		} else {
			this.setState({
				fecha: fecha,
				semanas: 0,
				dias: 0,
			});
		}
	};
	ChangeIconInAddButton = (change) => {
		const position = this.props.middleButtonAdd ? "middle" : "right";
		console.log(position);
		if (change)
			return (
				<Button icon floated={position} labelPosition="right" className="modal-button-add" onClick={this.ChangeModalState}>
					<Icon name="add circle" className="modal-icon-add" onClick={this.ChangeModalState} />
					Adicionar
				</Button>
			);
		else
			return (
				<Button icon floated={position} labelPosition="left" primary size="small" onClick={this.ChangeModalState} className="modal-button-add">
					<Icon name="add circle" className="modal-icon-add" />
					Adicionar
				</Button>
			);
	};
	ChoseType = () => {
		if (this.state.tipo === "Grupos Sanguineo") {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Grupo Sanguineo:</Segment>
					<Segment.Group>
						<Segment></Segment>
						<Segment></Segment>
					</Segment.Group>
				</Segment.Group>
			);
		} else if (this.state.tipo === "Identificación Anticuerpo") {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Identificación Anticuerpo:</Segment>
					<Segment.Group>
						<Segment></Segment>
						<Segment></Segment>
					</Segment.Group>
				</Segment.Group>
			);
		} else if (this.state.tipo === "Pesquizaje Anticuerpo") {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Pesquizaje Anticuerpo:</Segment>
					<Segment.Group>
						<Segment></Segment>
						<Segment></Segment>
					</Segment.Group>
				</Segment.Group>
			);
		}
	};
	PregnancyAge = () => {
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
									disabled={this.state.semanas === 42}
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
									disabled={this.state.dias === 7}
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
	};
	//#endregion

	//#region Render
	render() {
		return (
			<Modal open={this.state.openModal} trigger={this.ChangeIconInAddButton(this.props.cambiarIcono)}>
				<Header icon="syringe" content="Adicionar Prueba" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Group>
							<Segment className="modal-segment-expanded">
								<Header as="h5">Fecha de Planificación:</Header>
								<ComponentInputDatePicker SetDate={this.SetDate} restringir={false} />
							</Segment>
						</Form.Group>
						<Form.Group>{this.PregnancyAge()}</Form.Group>
						<Segment className="modal-segment-expanded-grouping">
							<Form.Group inline>
								<Header as="h5" className="header-custom">
									Tipo de Prueba:
								</Header>
								<Form.Radio
									name="radiogruposanguineo"
									labelPosition="right"
									label="Grupos Sanguineo"
									checked={this.state.tipo === "Grupos Sanguineo"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "Grupos Sanguineo",
										});
									}}
								/>
								<Form.Radio
									name="radioidentificacionanticuerpo"
									labelPosition="right"
									label="Identificación Anticuerpo"
									checked={this.state.tipo === "Identificación Anticuerpo"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "Identificación Anticuerpo",
											semanas: 0,
											dias: 0,
										});
									}}
								/>
								<Form.Radio
									name="radiopesquizajeanticuerpo"
									labelPosition="right"
									label="Pesquizaje Anticuerpo"
									checked={this.state.tipo === "Pesquizaje Anticuerpo"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "Pesquizaje Anticuerpo",
											semanas: 0,
											dias: 0,
										});
									}}
								/>
							</Form.Group>
						</Segment>
						<Form.Group>{this.ChoseType()}</Form.Group>
						<Form.Select
							name="examen"
							label="Examen:"
							placeholder="Seleccionar Examen"
							options={this.state.opcionExamenes}
							value={this.state.examen}
							onChange={(e, { value }) => {
								this.setState({ examen: value });
							}}
							fluid
							selection
							clearable
						/>
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
export default ComponentAddPruebas;
//#endregion
