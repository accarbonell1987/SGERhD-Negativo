//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form, Message, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment/moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentPruebas from "../pruebas/ComponentPruebas";
//#endregion

//#region Definicion Clase
class ComponentAddTest extends Component {
	//#region Properties
	state = {
		openModal: false,
		observaciones: "",
		embarazo: null,
		paciente: null,
		pruebas: [],
		tipo: "Embarazo",
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

		this.AddTest = this.AddTest.bind(this);
		this.ChangeModalInput = this.ChangeModalInput.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.ClearModalState = this.ClearModalState.bind(this);
		this.HandleSubmit = this.HandleSubmit.bind(this);
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
	AddTest = async () => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			let { observaciones, embarazo, paciente, pruebas, tipo, activo } = this.state;
			const test = {
				fecha: new Date(),
				observaciones: observaciones,
				embarazo: embarazo,
				paciente: paciente,
				pruebas: pruebas,
				tipo: tipo,
				activo: activo,
			};
			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/examen/", {
					method: "POST",
					body: JSON.stringify(test),
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
		const disabled = !this.state.fecha || (this.state.tipo === "Paciente" ? !this.state.paciente : !this.state.embarazo);
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
			if (await this.AddTest()) {
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
		} else if (evt.target.className.includes("modal-icon-accept") || evt.target.className.includes("modal-button-accept")) {
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
			observaciones: "",
			embarazo: embarazo,
			paciente: paciente,
			pruebas: [],
			tipo: tipo,
			activo: true,
			opcionPacientes: opcionPacientes,
			opcionEmbarazos: opcionEmbarazos,
			errorform: false,
		});
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
	//#endregion

	//#region Render
	render() {
		return (
			<Modal open={this.state.openModal} trigger={this.ChangeIconInAddButton(this.props.cambiarIcono)}>
				<Header icon="clipboard list" content="Adicionar Examen" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
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
						<Form.Group>{this.ChoseType()}</Form.Group>
						{/* <Segment.Group>
              <Segment as="h5">Pruebas:</Segment>
              <Segment>{this.DetailsTests()}</Segment>
            </Segment.Group> */}
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={this.state.tipo === "Paciente" ? !this.state.paciente : !this.state.embarazo}>
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
export default ComponentAddTest;
//#endregion
