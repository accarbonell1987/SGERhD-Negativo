//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
//#endregion

//#region Definicion Clase
class ComponentCompletePregnancy extends Component {
	//#region Properties
	state = {
		openModal: false,
		fecha: null,
		observaciones: "",
		examenes: [],
		tipo: "Antiguo",
		semanas: 0,
		dias: 0,
		findeembarazo: null, //parto o aborto
		findeparto: null, //natural o cesarea
		findeaborto: null, //espontaneo o provocado
		ninoparido: null, //Vivo o Muerto
		paciente: null,
		activo: true,
		opcionPacientes: [],
		errorform: false,
	};
	//#endregion

	//#region Constructor
	constructor(props) {
		super(props);

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
	//modificar usuario
	UpdatePregnancy = async (id) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			var { fecha, observaciones, examenes, tipo, semanas, dias, findeembarazo, findeparto, findeaborto, ninoparido, paciente, activo } = this.state;

			const pregnancy = {
				fecha: fecha,
				observaciones: observaciones,
				examenes: examenes,
				tipo: tipo,
				semanas: semanas,
				dias: dias,
				findeembarazo: findeembarazo,
				findeparto: findeparto,
				findeaborto: findeaborto,
				ninoparido: ninoparido,
				paciente: paciente,
				activo: activo,
			};

			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/embarazo/" + id, {
					method: "PATCH",
					body: JSON.stringify(pregnancy),
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

		let errorantiguo = false;
		if (this.state.tipo === "Antiguo") {
			if (this.state.findeembarazo === "Aborto") {
				if (this.state.findeaborto === "Provocado" || this.state.findeaborto === "Espontaneo") errorantiguo = false;
				else errorantiguo = true;
			} else if (this.state.findeembarazo === "Parto") {
				if (this.state.findeparto === "Normal" || this.state.findeparto === "Cesarea") {
					if (this.state.ninoparido === "Recien Nacido Vivo" || this.state.ninoparido === "Recien Nacido Muerto") {
						errorantiguo = false;
					} else errorantiguo = true;
				} else {
					errorantiguo = true;
				}
			} else {
				errorantiguo = true;
			}
		}

		let errform = errorantiguo;

		this.setState({
			errorform: errform,
		});

		return errform;
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
			if (await this.UpdatePregnancy(this.props.pregnancy._id)) {
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
			this.setState({
				openModal: true,
				fecha: this.props.pregnancy.fecha,
				observaciones: this.props.pregnancy.observaciones,
				examenes: this.props.pregnancy.examenes,
				semanas: this.props.pregnancy.semanas,
				dias: this.props.pregnancy.dias,
				findeembarazo: this.props.pregnancy.findeembarazo,
				findeaborto: this.props.pregnancy.findeaborto,
				findeparto: this.props.pregnancy.findeparto,
				ninoparido: this.props.pregnancy.ninoparido,
				paciente: this.props.pregnancy.paciente._id,
				activo: this.props.pregnancy.activo,
			});
		} else if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		} else {
			this.OnSubmit(evt);
		}
	};
	//limpiar states
	ClearModalState = () => {
		let opcion = [];
		this.props.pacientes.forEach((p) => {
			//solo almaceno los paciente que son hembras
			if (p.sexo === "F") {
				let nombreyapellidos = p.nombre + " " + p.apellidos;
				let cur = {
					key: p._id,
					text: nombreyapellidos,
					value: p._id,
					icon: "wheelchair",
				};
				opcion = [...opcion, cur];
			}
		});

		const paciente = this.props.paciente != null ? this.props.paciente : null;
		//actualizar los states
		this.setState({
			openModal: false,
			fecha: null,
			observaciones: "",
			examenes: [],
			tipo: "Antiguo",
			semanas: 0,
			dias: 0,
			findeembarazo: null, //parto o aborto
			findeparto: null, //natural o cesarea
			findeaborto: null, //espontaneo o provocado
			ninoparido: null, //Vivo o Muerto
			activo: true,
			paciente: paciente,
			opcionPacientes: opcion,
			errorform: false,
		});
	};
	ChoseChildState = () => {
		if (this.state.findeembarazo === "Parto") {
			return (
				<Form.Group inline>
					<Form.Radio
						name="radiopartoreciennacidovivo"
						labelPosition="right"
						label="Recien Nacido Vivo"
						checked={this.state.ninoparido === "Recien Nacido Vivo"}
						value={this.state.ninoparido}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								ninoparido: "Recien Nacido Vivo",
							});
						}}
					/>
					<Form.Radio
						name="radiopartoreciennacidomuerto"
						labelPosition="right"
						label="Recien Nacido Muerto"
						checked={this.state.ninoparido === "Recien Nacido Muerto"}
						value={this.state.ninoparido}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								ninoparido: "Recien Nacido Muerto",
							});
						}}
					/>
				</Form.Group>
			);
		}
	};
	//escoger fin de embarazo
	ChoseEndOfPregnancy = () => {
		if (this.state.findeembarazo === "Parto") {
			return (
				<Segment className="modal-segment-expanded-grouping">
					<Form.Group inline>
						<Form.Radio
							name="radiopartonatural"
							labelPosition="right"
							label="Normal"
							checked={this.state.findeparto === "Normal"}
							value={this.state.findeparto}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									findeparto: "Normal",
								});
							}}
						/>
						<Form.Radio
							name="radiopartocesarea"
							labelPosition="right"
							label="Cesarea"
							checked={this.state.findeparto === "Cesarea"}
							value={this.state.findeparto}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									findeparto: "Cesarea",
								});
							}}
						/>
					</Form.Group>
					<Segment>{this.ChoseChildState()}</Segment>
				</Segment>
			);
		} else if (this.state.findeembarazo === "Aborto") {
			return (
				<Form.Group inline>
					<Form.Radio
						name="radioabortonatural"
						labelPosition="right"
						label="Espontaneo"
						checked={this.state.findeaborto === "Espontaneo"}
						value={this.state.findeaborto}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								findeaborto: "Espontaneo",
							});
						}}
					/>
					<Form.Radio
						name="radioabortointerrumpido"
						labelPosition="right"
						label="Provocado"
						checked={this.state.findeaborto === "Provocado"}
						value={this.state.findeaborto}
						onChange={(evt) => {
							evt.preventDefault();
							this.setState({
								findeaborto: "Provocado",
							});
						}}
					/>
				</Form.Group>
			);
		}
	};
	//escoger tipo de embarazo
	ChoseType = () => {
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
								checked={this.state.findeembarazo === "Parto"}
								value={this.state.findeembarazo}
								onChange={(evt) => {
									evt.preventDefault();
									this.setState({
										findeembarazo: "Parto",
									});
								}}
							/>
							<Form.Radio
								name="radioaborto"
								labelPosition="right"
								label="Aborto"
								checked={this.state.findeembarazo === "Aborto"}
								value={this.state.findeembarazo}
								onChange={(evt) => {
									evt.preventDefault();
									this.setState({
										findeembarazo: "Aborto",
									});
								}}
							/>
						</Form.Group>
						<Segment>{this.ChoseEndOfPregnancy()}</Segment>
					</Segment>
				</Segment.Group>
			</Segment.Group>
		);
	};
	//#endregion

	//#region Render
	render() {
		return (
			<Modal
				open={this.state.openModal}
				trigger={
					<Button className="modal-button-action" onClick={this.ChangeModalState}>
						<Icon name="checkmark" className="modal-icon" color="green" onClick={this.ChangeModalState} />
					</Button>
				}
			>
				<Header icon="heartbeat" content="Fin de Embarazo" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Group>{this.ChoseType()}</Form.Group>
						<Form.TextArea name="observaciones" label="Observaciones:" placeholder="Observaciones..." value={this.state.observaciones} onChange={this.ChangeModalInput} />
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit">
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
export default ComponentCompletePregnancy;
//#endregion
