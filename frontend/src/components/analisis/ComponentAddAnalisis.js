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
class ComponentAddAnalisis extends Component {
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
		this.AddAnalisis = this.AddAnalisis.bind(this);
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
	AddAnalisis = async () => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			let { fecha, tipo, examen, pendiente, numeroMuestra, semanas, dias, activo } = this.state;

			let tiempoDeGestacion = null;
			//estructura del ReaccionAdversaDetalle
			//reaccionAdversaDetalle = {fiebre, vomito, ...}
			const detalle = { semanas, dias };
			tiempoDeGestacion = JSON.stringify(detalle);

			const analisis = {
				fecha: fecha,
				tipo: tipo,
				examen: examen,
				pendiente: pendiente,
				numeroMuestra: numeroMuestra,
				tiempoDeGestacion: tiempoDeGestacion,
				activo: activo,
			};
			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/analisis/", {
					method: "POST",
					body: JSON.stringify(analisis),
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
						timer: 10000,
					});
					return false;
				}
			} catch (err) {
				Swal.fire({
					position: "center",
					icon: "error",
					title: err,
					showConfirmButton: false,
					timer: 10000,
				});
				return false;
			}
		}
	};
	GetLastInserted = async () => {
		const cookiesdata = this.props.global.cookies();
		if (!cookiesdata) this.props.Deslogin();
		else {
			//enviar al endpoint
			const res = await fetch(this.props.global.endpoint + "api/analisis/-1", {
				method: "GET",
				headers: {
					"access-token": cookiesdata.token,
				},
			});
			let serverdata = await res.json();
			//capturar respuesta
			const { status, message, data } = serverdata;
			if (status === 200) return data;
			else
				Swal.fire({
					position: "center",
					icon: "error",
					title: message,
					showConfirmButton: false,
					timer: 5000,
				});
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
			if (await this.AddAnalisis()) {
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
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
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

			const examen = this.props.examen != null ? this.props.examen._id : null;
			this.ChoseExamen(examen);

			//obtener la fecha
			var fecha = new Date();
			const ano = fecha.getFullYear().toString();
			//extraer las partes para el formato de la historia clinica (año mes dia numeroconsecutivo) ej: 205280020
			let numero = ano + "-0001";

			//busco el ultimo insertado
			this.GetLastInserted().then((element) => {
				//chequeo que me devuelva un arreglo mayor que cero
				if (element.length > 0) {
					//convierto el numero en un string
					var numeroMuestra = element[0].numeroMuestra.toString();

					//pico el string por el guión -
					var elementosnumero = numeroMuestra.split("-");
					//si la primera parte del numero es igual a la suma de ano entonces
					if (elementosnumero[0] === ano) {
						//adiciono uno a la segunda parte del numero
						var addone = (parseInt(elementosnumero[1]) + 1).toString();
						//adicionar los ceros que necesito a la izquierda
						while (addone.length < 4) addone = "0" + addone;
						//lo almaceno en numero
						numero = ano + "-" + addone;
					}
					//lo pongo en el state
				}
				this.setState({ numeroMuestra: numero });
				//lo pongo en el state
			});
			//actualizar los states
			this.setState({
				openModal: false,
				fecha: null,
				tipo: "Grupo Sanguineo",
				examen: examen,
				grupoSanguineo: null,
				identificacionAnticuerpo: null,
				pesquizajeAnticuerpo: null,
				pendiente: true,
				activo: true,
				opcionExamenes: opcion,
				errorform: false,
			});
		}
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
	ChangeIconInAddButton = (change) => {
		const position = this.props.middleButtonAdd ? "middle" : "right";
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
			<Modal open={this.state.openModal} trigger={this.ChangeIconInAddButton(this.props.cambiarIcono)}>
				<Header icon="syringe" content="Adicionar Análisis" />
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
									<ComponentInputDatePicker SetDate={this.SetDate} restringir={false} />
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
export default ComponentAddAnalisis;
//#endregion
