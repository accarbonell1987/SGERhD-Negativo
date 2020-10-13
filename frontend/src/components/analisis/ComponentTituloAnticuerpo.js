//#region Importaciones
import React, { Component } from "react";
import { Header, Form, Segment, Modal, Message, Icon, Button, Dropdown } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
//#endregion

//#region Definicion Clase
class ComponentTituloAnticuerpo extends Component {
	//#region Properties
	state = {
		celula: null,
		diluciones: null,
		bajaconcentracion: null,
		referenciaIdentificacion: null,

		key: null,
		identificacionAnticuerpo: null,
		opcionIdentificacionAnticuerpo: null,
		opcionPotenciasDos: null,
		errorform: false,
	};
	//#endregion

	//#region Metodos y Eventos
	//componente se monto
	SwalAlert = (posicion, icon, mensaje, tiempo) => {
		Swal.fire({
			position: posicion,
			icon: icon,
			title: mensaje,
			showConfirmButton: false,
			timer: tiempo,
		});
	};
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
		if (evt.target.className.includes("modal-button-cancel") || evt.target.className.includes("modal-icon-cancel")) {
			this.setState({ openModal: false });
		} else if (evt.target.className.includes("modal-button-action") || evt.target.className.includes("modal-icon")) {
			this.ClearModalState();
			this.setState({ openModal: true });
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
	//al enviar a aplicar el formulario
	OnSubmit = async (evt) => {
		//si no hay problemas en el formulario
		if (this.HandleSubmit(evt) === false) {
			//si no hay problemas en la insercion
			if (await this.SetResults()) {
				//enviar a recargar los pacientes
				this.props.GetDataFromServer();
				this.ClearModalState();
			}
		}
	};
	//limpiar states
	ClearModalState = () => {
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			const detail = this.props.analisis.tituloAnticuerpo;

			let opcion = [];
			this.props.identificacionesAnticuerpo.forEach((e) => {
				let fechacadena = moment(new Date(e.fecha)).format("DD-MM-YYYY");
				let datos = "Prueba - Fecha: " + fechacadena + ", Número de Muestra: " + e.numeroMuestra;
				let cur = {
					key: e._id,
					text: datos,
					value: e._id,
					icon: "syringe",
				};
				opcion = [...opcion, cur];
			});

			let opcionPotenciasDos = [];
			let number = 2;
			let increment = 1;

			while (number <= 1024) {
				let cur = {
					key: number,
					text: number,
					value: number,
				};
				opcionPotenciasDos = [...opcionPotenciasDos, cur];
				number = Math.pow(2, ++increment);
			}

			const identificacion = this.props.identificacionesAnticuerpo.filter((p) => p.numeroMuestra === detail.referenciaIdentificacion);
			console.log(identificacion, detail);
			//actualizar los states
			this.setState({
				openModal: false,
				celula: detail.celula != null ? detail.celula : null,
				diluciones: detail.diluciones != null ? detail.diluciones : null,
				bajaconcentracion: detail.bajaconcentracion != null ? detail.bajaconcentracion : null,

				key: identificacion[0] ? identificacion[0]._id : 0,
				identificacionAnticuerpo: identificacion[0] ? identificacion[0] : null,
				opcionIdentificacionAnticuerpo: opcion,
				opcionPotenciasDos: opcionPotenciasDos,
				errorform: false,
			});
		}
	};
	SetResults = async () => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			const analisis = this.props.analisis;
			const detail = this.props.analisis.tituloAnticuerpo;
			const { celula, diluciones, bajaconcentracion } = this.state;

			const indentificacion = this.props.identificacionesAnticuerpo.filter((p) => p._id === this.state.key);

			detail.celula = celula;
			detail.diluciones = diluciones;
			detail.bajaconcentracion = bajaconcentracion;
			detail.referenciaIdentificacion = indentificacion[0].numeroMuestra;

			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/tituloanticuerpo/" + detail._id, {
					method: "PATCH",
					body: JSON.stringify(detail),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"access-token": data.token,
					},
				});
				const resanalisis = await fetch(this.props.global.endpoint + "api/analisis/" + analisis._id, {
					method: "PATCH",
					body: JSON.stringify(analisis),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"access-token": data.token,
					},
				});

				let serverdata = await res.json();
				let serverdataanalisis = await resanalisis.json();

				if (serverdata.status === 200 && serverdataanalisis.status === 200) {
					this.SwalAlert("center", "success", serverdata.message, 3000);
					return true;
				} else {
					this.SwalAlert("center", "error", serverdata.message + " - " + serverdataanalisis.message, 5000);
					return false;
				}
			} catch (err) {
				this.SwalAlert("center", "error", err, 5000);
				return false;
			}
		}
	};
	//#endregion

	//#region Render
	render() {
		return (
			<Modal
				// className="modal-windows-pregnancies"
				open={this.state.openModal}
				trigger={
					<Button className="modal-button-action" onClick={this.ChangeModalState}>
						<Icon name="checkmark" className="modal-icon" color="green" onClick={this.ChangeModalState} />
					</Button>
				}
			>
				<Header icon="syringe" content="Resultados de Titulo de Anticuerpo" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Input disabled name="numero" icon="address card outline" iconPosition="left" label="Numero de Muestra:" value={this.props.analisis.numeroMuestra} />
						<Form.Select
							name="pIdentificacionAnticuerpo"
							label="Prueba Identificación Anticuerpo:"
							placeholder="Seleccionar Prueba"
							options={this.state.opcionIdentificacionAnticuerpo}
							value={this.state.key}
							onChange={(e, { value }) => {
								this.setState({ key: value });
							}}
							fluid
							selection
						/>
						{this.state.key != null ? (
							<Segment.Group>
								<Segment>
									<Form.Input name="celula" icon="eye dropper" iconPosition="left" label="Celula:" value={this.state.celula} placeholder="Escribir..." onChange={this.ChangeModalInput} onKeyDown={this.OnPressEnter} />
								</Segment>
								<Segment.Group horizontal>
									<Segment>
										<Header as="h5">Diluciones:</Header>
										<Dropdown
											name="diluciones"
											text={this.state.diluciones === null ? "Seleccionar..." : this.state.diluciones}
											item
											selection
											options={this.state.opcionPotenciasDos}
											onChange={(e, { value }) => {
												this.setState({ diluciones: value });
											}}
										/>
									</Segment>
									<Segment>
										<Header as="h5">Baja Concetración:</Header>
										<Form.Checkbox
											toggle
											name="bajaconcentracion"
											labelPosition="left"
											label={this.state.bajaconcentracion === true ? "Si" : "No"}
											value={this.state.bajaconcentracion}
											checked={this.state.bajaconcentracion}
											onChange={(evt) => {
												evt.preventDefault();
												this.setState({
													bajaconcentracion: !this.state.bajaconcentracion,
												});
											}}
										/>
									</Segment>
								</Segment.Group>
							</Segment.Group>
						) : (
							""
						)}
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" className="modal-icon-cancel" />
						Cancelar
					</Button>
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.key || !this.state.celula || !this.state.diluciones}>
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
export default ComponentTituloAnticuerpo;
//#endregion
