//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentInputDatePicker from "../generales/ComponentInputDatePicker";
//#endregion

//#region Definicion Clase
class ComponentUpdateTran extends Component {
	//#region Estados y Declaraciones
	state = {
		openModal: false,
		fecha: null,
		reaccionAdversa: false,
		fiebre: false,
		vomito: false,
		escalofrio: false,
		rasch: false,
		prurito: false,
		dolorcabeza: false,
		mareo: false,
		ictero: false,
		hemorragia: false,
		observaciones: "",
		paciente: null,
		opcionPacientes: [],
		activo: true,
		errorform: false,
	};
	//#endregion

	//#region Constructor
	constructor(props) {
		super(props);

		this.SetDate = this.SetDate.bind(this);
		this.UpdateTran = this.UpdateTran.bind(this);
		this.ChangeModalInput = this.ChangeModalInput.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.ClearModalState = this.ClearModalState.bind(this);
		this.HandleSubmit = this.HandleSubmit.bind(this);
	}
	//#endregion

	//#region Metodos y Eventos
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
	//modificar usuario
	UpdateTran = async (id) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			const { fecha, reaccionAdversa, fiebre, vomito, escalofrio, rasch, prurito, dolorcabeza, mareo, ictero, hemorragia, observaciones, paciente, activo } = this.state;

			let reaccionAdversaDetalles = null;
			if (reaccionAdversa) {
				//estructura del ReaccionAdversaDetalle
				//reaccionAdversaDetalle = {fiebre, vomito, ...}
				const detalle = { fiebre, vomito, escalofrio, rasch, prurito, dolorcabeza, mareo, ictero, hemorragia };
				reaccionAdversaDetalles = JSON.stringify(detalle);
			}

			const tran = {
				fecha: fecha,
				reaccionAdversa: reaccionAdversa,
				reaccionAdversaDetalles: reaccionAdversaDetalles,
				observaciones: observaciones,
				paciente: paciente,
				activo: activo,
			};
			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/transfusion/" + id, {
					method: "PATCH",
					body: JSON.stringify(tran),
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
			if (await this.UpdateTran(this.props.tran._id)) {
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

			let fecha = new Date(this.props.tran.fecha);
			const detalles = JSON.parse(this.props.tran.reaccionAdversaDetalles);
			this.setState({
				openModal: true,
				fecha: fecha,
				reaccionAdversa: this.props.tran.reaccionAdversa,
				fiebre: detalles.fiebre,
				vomito: detalles.vomito,
				escalofrio: detalles.escalofrio,
				rasch: detalles.rasch,
				prurito: detalles.prurito,
				dolorcabeza: detalles.dolorcabeza,
				mareo: detalles.mareo,
				ictero: detalles.ictero,
				hemorragia: detalles.hemorragia,
				observaciones: this.props.tran.observaciones,
				paciente: this.props.tran.paciente,
				activo: this.props.tran.activo,
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
			let nombreyapellidos = p.nombre + " " + p.apellidos;
			let cur = { key: p._id, text: nombreyapellidos, value: p._id, icon: "wheelchair" };
			opcion = [...opcion, cur];
		});

		const pacienteid = this.props.paciente != null ? this.props.paciente._id : "";
		//actualizar los states
		this.setState({
			openModal: false,
			fecha: "",
			reaccionAdversa: false,
			fiebre: false,
			vomito: false,
			escalofrio: false,
			rasch: false,
			prurito: false,
			dolorcabeza: false,
			mareo: false,
			ictero: false,
			hemorragia: false,
			observaciones: "",
			paciente: pacienteid,
			opcionPacientes: opcion,
			activo: true,
			errorform: false,
		});
	};
	//capturar fecha
	SetDate = (fecha) => {
		this.setState({ fecha: fecha });
	};
	ChoseAdvReactionDetails = () => {
		if (this.state.reaccionAdversa) {
			return (
				<Segment.Group className="segmentgroup-correct">
					<Segment as="h5">Detalles Reacción Adversa:</Segment>
					<Segment.Group horizontal>
						<Form.Checkbox
							className="checkbox-group"
							name="fiebre"
							labelPosition="left"
							label="Fiebre"
							checked={this.state.fiebre}
							value={this.state.fiebre}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									fiebre: !this.state.fiebre,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="vomito"
							labelPosition="left"
							label="Vómito"
							checked={this.state.vomito}
							value={this.state.vomito}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									vomito: !this.state.vomito,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="escalofrio"
							labelPosition="left"
							label="Escalofríos"
							checked={this.state.escalofrio}
							value={this.state.escalofrio}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									escalofrio: !this.state.escalofrio,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="rasch"
							labelPosition="left"
							label="Rasch"
							checked={this.state.rasch}
							value={this.state.rasch}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									rasch: !this.state.rasch,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="prurito"
							labelPosition="left"
							label="Prurito"
							checked={this.state.prurito}
							value={this.state.prurito}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									prurito: !this.state.prurito,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="dolorcabeza"
							labelPosition="left"
							label="Dolor de Cabeza"
							checked={this.state.dolorcabeza}
							value={this.state.dolorcabeza}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									dolorcabeza: !this.state.dolorcabeza,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="mareo"
							labelPosition="left"
							label="Mareo"
							checked={this.state.mareo}
							value={this.state.mareo}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									mareo: !this.state.mareo,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="ictero"
							labelPosition="left"
							label="Íctero"
							checked={this.state.ictero}
							value={this.state.ictero}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									ictero: !this.state.ictero,
								});
							}}
						/>
						<Form.Checkbox
							className="checkbox-group"
							name="hemorragia"
							labelPosition="left"
							label="Hemorragia"
							checked={this.state.hemorragia}
							value={this.state.hemorragia}
							onChange={(evt) => {
								evt.preventDefault();
								this.setState({
									hemorragia: !this.state.hemorragia,
								});
							}}
						/>
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
				<Header icon="tint" content="Modificar Transfusión" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Group>
							<Segment className="modal-segment-expanded">
								<Header as="h5">Fecha:</Header>
								<ComponentInputDatePicker SetDate={this.SetDate} fecha={this.state.fecha} restringir={false} />
							</Segment>
						</Form.Group>
						<Form.Group>
							<Segment className="modal-segment-expanded">
								<Header as="h5">Reacción Adversa:</Header>
								<Form.Checkbox
									toggle
									name="reaccionAdversa"
									labelPosition="left"
									label={this.state.reaccionAdversa === true ? "Si" : "No"}
									value={this.state.reaccionAdversa}
									checked={this.state.reaccionAdversa}
									onChange={(evt) => {
										evt.preventDefault();
										this.setState({
											reaccionAdversa: !this.state.reaccionAdversa,
										});
									}}
								/>
							</Segment>
						</Form.Group>
						<Form.Group>{this.ChoseAdvReactionDetails()}</Form.Group>
						<Form.TextArea name="observaciones" label="Observaciones:" placeholder="Observaciones..." value={this.state.observaciones} onChange={this.ChangeModalInput} />
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
						<Form.Group>
							<Segment className="modal-segment-expanded">
								<Header as="h5">Activo:</Header>
								<Form.Checkbox
									toggle
									name="activo"
									labelPosition="left"
									label={this.state.activo === true ? "Si" : "No"}
									value={this.state.activo}
									checked={this.state.activo}
									onChange={(evt) => {
										evt.preventDefault();
										//solo permito activar y en caso de que este desactivado
										if (!this.state.activo)
											this.setState({
												activo: !this.state.activo,
											});
										else {
											this.SwalAlert("center", "warning", "Solo se permite desactivar desde el bóton de Desactivar/Eliminar", 5000);
										}
									}}
								/>
							</Segment>
						</Form.Group>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.fecha || !this.state.paciente}>
						<Icon name="checkmark" />
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
export default ComponentUpdateTran;
//#endregion
