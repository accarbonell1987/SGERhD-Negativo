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
class ComponentUpdateAnalisis extends Component {
	//#region Properties
	state = {
		openModal: false,
		fecha: null,
		tipo: "Grupo Sanguineo",
		examen: null,
		grupoSanguineo: null,
		identificacionAnticuerpo: null,
		pesquizajeAnticuerpo: null,
		pendiente: true,
		numeroMuestra: "",
		semanas: 0,
		dias: 0,
		activo: true,
		tipoanalisis: null,
		opcionExamenes: [],
		errorform: false,
	};
	//#endregion

	//#region Constructor
	constructor(props) {
		super(props);

		this.SetDate = this.SetDate.bind(this);
		this.UpdateAnalisis = this.UpdateAnalisis.bind(this);
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
	SwalAlert = (posicion, icon, mensaje, tiempo) => {
		Swal.fire({
			position: posicion,
			icon: icon,
			title: mensaje,
			showConfirmButton: false,
			timer: tiempo,
		});
	};
	UpdateAnalisis = async (id) => {
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

			const analisis = {
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
				const res = await fetch(this.props.global.endpoint + "api/analisis/" + id, {
					method: "PATCH",
					body: JSON.stringify(analisis),
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
			if (await this.UpdateAnalisis(this.props.one._id)) {
				//enviar a recargar los pacientes
				this.props.GetDataFromServer();
				this.ClearModalState();
			}
		}
	};
	//cambiar el estado en el MODAL para adicionar
	ChangeModalState = async (evt) => {
		if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		} else if (evt.target.className.includes("modal-button-action") || evt.target.className.includes("modal-icon")) {
			this.ClearModalState();

			const analisis = this.props.one;

			let { semanas, dias } = 0;
			if (analisis.tiempoDeGestacion) {
				const tiempoDeGestacion = JSON.parse(analisis.tiempoDeGestacion);
				semanas = tiempoDeGestacion.semanas;
				dias = tiempoDeGestacion.dias;
			}

			this.ChoseExamen(analisis.examen._id);
			this.setState({
				openModal: true,
				fecha: analisis.fecha,
				tipo: analisis.tipo,
				grupoSanguineo: analisis.grupoSanguineo,
				identificacionAnticuerpo: analisis.identificacionAnticuerpo,
				pesquizajeAnticuerpo: analisis.pesquizajeAnticuerpo,
				pendiente: analisis.pendiente,
				numeroMuestra: analisis.numeroMuestra,
				semanas: semanas,
				dias: dias,
				activo: analisis.activo,
			});
		} else {
			this.OnSubmit(evt);
		}
	};
	//limpiar states
	ClearModalState = () => {
		let opcion = [];
		this.props.examenes.forEach((e) => {
			let fechacadena = moment(new Date(e.fecha)).format("DD-MM-YYYY");
			let datos = "Examen - Fecha: " + fechacadena + ", Tipo: " + e.tipo;
			let cur = {
				key: e._id,
				text: datos,
				value: e._id,
				icon: "clipboard list",
			};
			opcion = [...opcion, cur];
		});

		//actualizar los states
		this.setState({
			openModal: false,
			fecha: null,
			tipo: "Grupo Sanguineo",
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
		const examen = this.state.examen ? this.props.examenes.find((e) => e._id === this.state.examen) : null;
		if (examen && examen.tipo === "Embarazo") {
			const embarazo = examen.embarazo;
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
	ChoseType = () => {
		let { colorGSanguineo, colorPAnticuerpo, colorIAnticuerpo } = "gray";

		if (this.state.tipo === "Grupo Sanguineo") colorGSanguineo = "teal";
		else if (this.state.tipo === "Pesquizaje Anticuerpo") colorIAnticuerpo = "blue";
		else if (this.state.tipo === "Identificación Anticuerpo") colorPAnticuerpo = "violet";

		return (
			<Button.Group className="segmentgroup-correct">
				<Button
					size="large"
					color={colorGSanguineo}
					className="button-changeToGSanguineo"
					onClick={(evt) => {
						evt.preventDefault();
						this.setState({
							tipo: "Grupo Sanguineo",
						});
					}}
				>
					Grupo Sanguineo
				</Button>
				<Button
					size="large"
					color={colorIAnticuerpo}
					className="button-changeToIAnticuerpo"
					onClick={(evt) => {
						evt.preventDefault();
						this.setState({
							tipo: "Pesquizaje Anticuerpo",
						});
					}}
				>
					Pesquizaje Anticuerpo
				</Button>
				<Button
					size="large"
					color={colorPAnticuerpo}
					className="button-changeToPAnticuerpo"
					onClick={(evt) => {
						evt.preventDefault();
						this.setState({
							tipo: "Identificación Anticuerpo",
						});
					}}
				>
					Identificación Anticuerpo
				</Button>
			</Button.Group>
		);
	};
	PregnancyAge = () => {
		if (this.state.tipoanalisis === "Embarazo" && this.state.examen) {
			return (
				<Segment.Group>
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
	ChoseExamen = (value) => {
		if (value) {
			const examen = this.props.examenes.find((e) => e._id === value);
			if (examen.tipo === "Embarazo") {
				this.setState({ examen: value, tipoanalisis: "Embarazo" });
			} else {
				this.setState({ examen: value, tipoanalisis: "Paciente" });
			}
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
				<Header icon="syringe" content="Modificar Análisis" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Input disabled name="numero" icon="address card outline" iconPosition="left" label="Numero de Muestra:" value={this.state.numeroMuestra} />
						<Segment className="modal-segment-expanded-grouping">
							<Header as="h5" className="header-custom">
								Tipo de analisis:
							</Header>
							<Form.Group>{this.ChoseType()}</Form.Group>
						</Segment>
						<Segment className="modal-segment-expanded-margin10">
							<Form.Select
								name="examen"
								label="Examen:"
								placeholder="Seleccionar Examen"
								options={this.state.opcionExamenes}
								value={this.state.examen}
								onChange={(e, { value }) => {
									this.ChoseExamen(value);
								}}
								fluid
								selection
								clearable
							/>
						</Segment>
						{this.state.examen != null || this.state.examen === "" ? (
							<Form.Group>
								<Segment className="modal-segment-expanded">
									<Header as="h5">Fecha de Planificación:</Header>
									<ComponentInputDatePicker fecha={this.state.fecha} SetDate={this.SetDate} restringir={false} />
								</Segment>
							</Form.Group>
						) : (
							""
						)}
						{this.PregnancyAge()}
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.fecha || !this.state.examen}>
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
export default ComponentUpdateAnalisis;
//#endregion
