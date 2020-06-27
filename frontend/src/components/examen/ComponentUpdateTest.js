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
import ComponentPruebas from "../pruebas/ComponentPruebas";
import ComponentInputDatePicker from "../generales/ComponentInputDatePicker";
//#endregion

//#region Definicion Clase
class ComponentUpdateTest extends Component {
	//#region Properties
	state = {
		openModal: false,
		fecha: null,
		observaciones: "",
		embarazo: null,
		paciente: null,
		pruebas: [],
		tipo: "Embarazo",
		semanas: 0,
		dias: 0,
		activo: true,
		opcionPacientes: [],
		opcionEmbarazos: [],
		errortiempogestacion: false,
		errorform: false,
	};
	//#endregion

	//#region Constructor
	constructor(props) {
		super(props);

		this.SetDate = this.SetDate.bind(this);
		this.ChangeModalInput = this.ChangeModalInput.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.ClearModalState = this.ClearModalState.bind(this);
		this.HandleSubmit = this.HandleSubmit.bind(this);
	}
	//#endregion

	//#region Metodos y Eventos
	SwalAlert = (posicion, icon, mensaje, tiempo) => {
		Swal.fire({
			position: posicion,
			icon: icon,
			title: mensaje,
			showConfirmButton: false,
			timer: tiempo,
		});
	};

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
	SetDate = (fecha) => {
		if (this.props.embarazo || this.state.embarazo) {
			const embarazo = this.props.embarazo ? this.props.embarazo : this.props.embarazos.find((e) => e._id === this.state.embarazo);
			//calcular el dia de la semana
			const ahora = moment(fecha);
			const fechaSeleccionada = moment(embarazo.fecha);
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
	//modificar usuario
	UpdatePregnancy = async (id) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			let { fecha, observaciones, embarazo, paciente, pruebas, tipo, semanas, dias, activo } = this.state;

			let tiempoDeGestacion = null;
			if (this.state.tipo === "Embarazo") {
				//estructura del ReaccionAdversaDetalle
				//reaccionAdversaDetalle = {fiebre, vomito, ...}
				const detalle = { semanas, dias };
				tiempoDeGestacion = JSON.stringify(detalle);
			}

			const test = {
				fecha: fecha,
				observaciones: observaciones,
				embarazo: embarazo,
				paciente: paciente,
				pruebas: pruebas,
				tipo: tipo,
				tiempoDeGestacion: tiempoDeGestacion,
				activo: activo,
			};
			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/examen/" + id, {
					method: "PATCH",
					body: JSON.stringify(test),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"access-token": data.token,
					},
				});
				let serverdata = await res.json();
				const { status, message } = serverdata;
				if (status === 200) {
					this.SwalAlert("center", "success", message, 3000);
					return true;
				} else {
					this.SwalAlert("center", "error", message, 5000);
					return false;
				}
			} catch (err) {
				this.SwalAlert("center", "error", err, 5000);
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
			if (await this.UpdatePregnancy(this.props.embarazo._id)) {
				//enviar a recargar los pacientes
				this.props.GetDataFromServer();
				this.ClearModalState();
			}
		}
	};
	//cambiar el estado en el MODAL para adicionar
	ChangeModalState = async (evt) => {
		if (evt.target.className.includes("modal-button-action") || evt.target.className.includes("modal-icon")) {
			this.ClearModalState();
			this.SetDate(this.props.examen.fecha);
			//buscar las semanas y dias
			let { semanas, dias } = 0;
			if (this.props.examen.tiempoDeGestacion) {
				const tiempoDeGestacion = JSON.parse(this.props.examen.tiempoDeGestacion);
				semanas = tiempoDeGestacion.semanas;
				dias = tiempoDeGestacion.dias;
			}

			this.setState({
				openModal: true,
				fecha: this.props.examen.fecha,
				observaciones: this.props.examen.observaciones,
				embarazo: this.props.examen.embarazo,
				paciente: this.props.examen.paciente,
				pruebas: this.props.examen.pruebas,
				tipo: this.props.examen.tipo,
				semanas: semanas,
				dias: dias,
				activo: this.props.examen.activo,
			});
		} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		} else {
			this.OnSubmit(evt);
		}
	};
	//limpiar states
	ClearModalState = () => {
		let opcionPacientes = [];
		let opcionEmbarazos = [];

		this.props.pacientes.forEach((p) => {
			//solo almaceno los paciente que son hembras
			let nombreyapellidos = p.nombre + " " + p.apellidos;
			let cur = {
				key: p._id,
				text: nombreyapellidos,
				value: p._id,
				icon: "wheelchair",
			};
			opcionPacientes = [...opcionPacientes, cur];
		});
		this.props.embarazos
			.sort((last, next) => (last.fecha > next.fecha ? 1 : -1))
			.forEach((e) => {
				let fechacadena = moment(new Date(e.fecha)).format("DD-MM-YYYY");
				let nombreyapellidos = e.paciente.nombre + " " + e.paciente.apellidos + " - " + fechacadena + " - Tipo: " + e.tipo;
				let cur = {
					key: e._id,
					text: nombreyapellidos,
					value: e._id,
					icon: "heartbeat",
				};
				opcionEmbarazos = [...opcionEmbarazos, cur];
			});

		const paciente = this.props.paciente != null ? this.props.paciente._id : null;
		const embarazo = this.props.embarazo != null ? this.props.embarazo._id : null;
		const tipo = paciente ? "Paciente" : "Embarazo";

		//actualizar los states
		this.setState({
			openModal: false,
			fecha: null,
			observaciones: "",
			embarazo: embarazo,
			paciente: paciente,
			pruebas: [],
			tipo: tipo,
			activo: true,
			semanas: 0,
			dias: 0,
			opcionPacientes: opcionPacientes,
			opcionEmbarazos: opcionEmbarazos,
			errorform: false,
		});
	};
	ChoseType = () => {
		if (this.state.tipo === "Paciente") {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Paciente:</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Form.Select
								name="paciente"
								placeholder="Seleccionar Paciente"
								options={this.state.opcionPacientes}
								value={this.state.paciente}
								onChange={(e, { value }) => {
									this.setState({ paciente: value });
								}}
								fluid
								selection
								clearable
							/>
						</Segment>
					</Segment.Group>
				</Segment.Group>
			);
		} else {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Embarazo:</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Form.Select
								name="embarazo"
								placeholder="Seleccionar Embarazo"
								options={this.state.opcionEmbarazos}
								value={this.state.embarazo}
								onChange={(e, { value }) => {
									this.setState({ embarazo: value });
								}}
								fluid
								selection
								clearable
							/>
						</Segment>
					</Segment.Group>
				</Segment.Group>
			);
		}
	};
	DetailsTests = () => {
		return <ComponentPruebas Deslogin={this.props.Deslogin} global={this.props.global} middleButtonAdd={false} examenes={this.props.examenes} pruebas={this.props.pruebas} detail={true} GetDataFromServer={this.props.GetDataFromServer} />;
	};
	PregnancyAge = () => {
		if (this.state.tipo === "Embarazo") {
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
		}
	};
	//#endregion

	//#region Render
	render() {
		return (
			<Modal
				open={this.state.openModal}
				trigger={
					<Button className="modal-button-action" onClick={this.ChangeModalState}>
						<Icon name="edit" className="modal-icon" onClick={this.ChangeModalState} />
					</Button>
				}
			>
				<Header icon="heartbeat" content="Modificar Examen" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Group>
							<Segment className="modal-segment-expanded">
								<Header as="h5">Fecha:</Header>
								<ComponentInputDatePicker SetDate={this.SetDate} restringir={false} />
							</Segment>
						</Form.Group>
						<Form.TextArea name="observaciones" label="Observaciones:" placeholder="Observaciones..." value={this.state.observaciones} onChange={this.ChangeModalInput} />
						<Segment className="modal-segment-expanded-grouping">
							<Form.Group inline>
								<Header as="h5" className="header-custom">
									Vinculado A:
								</Header>
								<Form.Radio
									name="radioembarazo"
									labelPosition="right"
									label="Embarazo"
									checked={this.state.tipo === "Embarazo"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "Embarazo",
											paciente: null,
										});
									}}
								/>
								<Form.Radio
									name="radiopaciente"
									labelPosition="right"
									label="Paciente"
									checked={this.state.tipo === "Paciente"}
									value={this.state.tipo}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											tipo: "Paciente",
											embarazo: null,
										});
									}}
								/>
							</Form.Group>
						</Segment>
						<Form.Group>{this.PregnancyAge()}</Form.Group>
						<Form.Group>{this.ChoseType()}</Form.Group>
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
export default ComponentUpdateTest;
//#endregion
