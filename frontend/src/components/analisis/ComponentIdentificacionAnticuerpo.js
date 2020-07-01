//#region Importaciones
import React, { Component } from "react";
import { Header, Form, Segment, Modal, Message, Icon, Button, Table, Label, Dropdown } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
//#endregion

//#region Definicion Clase
class ComponentIdentificacionAnticuerpo extends Component {
	//#region Properties
	state = {
		factor: null,
		grupokey: null,
		grupoCompleto: null,
		celula1: null,
		celula2: null,
		celula3: null,
		cresultadocelula1: null,
		cresultadocelula2: null,
		cresultadocelula3: null,
		cresultadofinal: false,
		ps4resultadocelula1: null,
		ps4resultadocelula2: null,
		ps4resultadocelula3: null,
		ps4resultadofinal: false,
		ps37resultadocelula1: null,
		ps37resultadocelula2: null,
		ps37resultadocelula3: null,
		ps37resultadofinal: false,
		opcionGruposSanguineo: null,
		errorform: false,
	};

	opcionTipoCelulasPositivas = [
		{ key: "7", text: "7", value: "7", icon: "" },
		{ key: "12", text: "12", value: "12", icon: "" },
		{ key: "45", text: "45", value: "45", icon: "" },
		{ key: "34", text: "34", value: "34", icon: "" },
		{ key: "57", text: "57", value: "57", icon: "" },
		{ key: "5", text: "5", value: "5", icon: "" },
		{ key: "15", text: "15", value: "15", icon: "" },
		{ key: "37", text: "37", value: "37", icon: "" },
		{ key: "Mercedes", text: "Mercedes", value: "Mercedes", icon: "" },
		{ key: "Iliana", text: "Iliana", value: "Iliana", icon: "" },
		{ key: "Niurka", text: "Niurka", value: "Niurka", icon: "" },
		{ key: "Viviana", text: "Viviana", value: "Viviana", icon: "" },
		{ key: "Yailin", text: "Yailin", value: "Yailin", icon: "" },
		{ key: "Roeldis", text: "Roeldis", value: "Roeldis", icon: "" },
		{ key: "Nidia", text: "Nidia", value: "Nidia", icon: "" },
		{ key: "Nestor", text: "Nestor", value: "Nestor", icon: "" },
		{ key: "Gabriel", text: "Gabriel", value: "Gabriel", icon: "" },
		{ key: "JuanCarlos", text: "JuanCarlos", value: "JuanCarlos", icon: "" },
		{ key: "Oscar", text: "Oscar", value: "Oscar", icon: "" },
		{ key: "Vladimir", text: "Vladimir", value: "Vladimir", icon: "" },
		{ key: "Gloria", text: "Gloria", value: "Gloria", icon: "" },
	];
	opcionTipoCelulasNegativas = [
		{ key: "101", text: "101", value: "101", icon: "" },
		{ key: "102", text: "102", value: "102", icon: "" },
		{ key: "103", text: "103", value: "103", icon: "" },
		{ key: "109", text: "109", value: "109", icon: "" },
		{ key: "Onelbis", text: "Onelbis", value: "Onelbis", icon: "" },
	];
	opcionResultados = [
		{ key: "+", text: "+", value: "+", icon: "" },
		{ key: "++", text: "++", value: "++", icon: "" },
		{ key: "+++", text: "+++", value: "+++", icon: "" },
		{ key: "++++", text: "++++", value: "++++", icon: "" },
		{ key: "-", text: "-", value: "-", icon: "" },
		{ key: "+-", text: "+-", value: "+-", icon: "" },
	];
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
			let opcion = [];
			this.props.gruposSanguineo.forEach((e) => {
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

			const detail = this.props.analisis.identificacionAnticuerpo;

			//{resultadocelula1, resultadocelula2, resultadocelula3, resultadofinal}
			const coombs = JSON.parse(detail.pCoomsIndirecto);
			const salina4g = JSON.parse(detail.pSalina4g);
			const salina37g = JSON.parse(detail.pSalina37g);

			console.log(detail, coombs);

			//actualizar los states
			this.setState({
				openModal: false,
				factor: null,
				grupokey: null,
				grupoCompleto: null,
				celula1: detail.celula1,
				celula2: detail.celula2,
				celula3: detail.celula3,
				cresultadocelula1: coombs != null ? coombs.resultadocelula1 : null,
				cresultadocelula2: coombs != null ? coombs.resultadocelula2 : null,
				cresultadocelula3: coombs != null ? coombs.resultadocelula3 : null,
				cresultadofinal: coombs != null ? coombs.resultadofinal : false,
				ps4resultadocelula1: salina4g != null ? salina4g.resultadocelula1 : null,
				ps4resultadocelula2: salina4g != null ? salina4g.resultadocelula2 : null,
				ps4resultadocelula3: salina4g != null ? salina4g.resultadocelula3 : null,
				ps4resultadofinal: salina4g != null ? salina4g.resultadofinal : false,
				ps37resultadocelula1: salina37g != null ? salina37g.resultadocelula1 : null,
				ps37resultadocelula2: salina37g != null ? salina37g.resultadocelula2 : null,
				ps37resultadocelula3: salina37g != null ? salina37g.resultadocelula3 : null,
				ps37resultadofinal: salina37g != null ? salina37g.resultadofinal : false,
				opcionGruposSanguineo: opcion,
				errorform: false,
			});
		}
	};
	SetResults = async () => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			let analisis = this.props.analisis;
			analisis.pendiente = false;

			const pCoomsIndirecto = JSON.stringify({
				resultadocelula1: this.state.cresultadocelula1,
				resultadocelula2: this.state.cresultadocelula2,
				resultadocelula3: this.state.cresultadocelula3,
				resultadofinal: this.state.cresultadofinal,
			});
			const pSalina4g = JSON.stringify({
				resultadocelula1: this.state.ps4resultadocelula1,
				resultadocelula2: this.state.ps4resultadocelula2,
				resultadocelula3: this.state.ps4resultadocelula3,
				resultadofinal: this.state.ps4resultadofinal,
			});
			const pSalina37g = JSON.stringify({
				resultadocelula1: this.state.ps37resultadocelula1,
				resultadocelula2: this.state.ps37resultadocelula2,
				resultadocelula3: this.state.ps37resultadocelula3,
				resultadofinal: this.state.ps37resultadofinal,
			});

			let detail = this.props.analisis.identificacionAnticuerpo;
			detail.celula1 = this.state.celula1;
			detail.celula2 = this.state.celula2;
			detail.celula3 = this.state.celula3;
			detail.pCoomsIndirecto = pCoomsIndirecto;
			detail.pSalina4g = pSalina4g;
			detail.pSalina37g = pSalina37g;

			//la promise debe de devolver un valor RETURN
			try {
				const res = await fetch(this.props.global.endpoint + "api/identificacionanticuerpo/" + detail._id, {
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
	Validar = () => {
		return (
			this.state.celula1 != null &&
			this.state.celula2 != null &&
			this.state.celula3 != null &&
			this.state.cresultadocelula1 != null &&
			this.state.cresultadocelula2 != null &&
			this.state.cresultadocelula3 != null &&
			this.state.ps4resultadocelula1 != null &&
			this.state.ps4resultadocelula2 != null &&
			this.state.ps4resultadocelula3 != null &&
			this.state.ps37resultadocelula1 != null &&
			this.state.ps37resultadocelula2 != null &&
			this.state.ps37resultadocelula3 != null
		);
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
				<Header icon="syringe" content="Resultados de Identificacion de Anticuerpo" />
				<Modal.Content>
					{this.state.errorform ? <Message error inverted header="Error" content="Error en el formulario" /> : null}
					<Form ref="form" onSubmit={this.ChangeModalState}>
						<Form.Input disabled name="numero" icon="address card outline" iconPosition="left" label="Numero de Muestra:" value={this.props.analisis.numeroMuestra} />
						<Form.Select
							name="pGrupoSanguineo"
							label="Prueba Grupo Sanguineo:"
							placeholder="Seleccionar Prueba"
							options={this.state.opcionGruposSanguineo}
							value={this.state.grupokey}
							onChange={(e, { value }) => {
								const grupoCompleto = this.props.gruposSanguineo.find((e) => e._id === value);
								this.setState({ grupokey: value, grupoCompleto: grupoCompleto });
							}}
							fluid
							selection
						/>
						{this.state.grupokey != null ? (
							<Segment.Group>
								<Segment.Group horizontal>
									<Segment>
										<Header as="h5">Celula No.1</Header>
										<Dropdown
											className="modal-input-30p"
											name="celula1"
											text={this.state.celula1 === null ? "Seleccionar Célula" : this.state.celula1}
											item
											selection
											options={this.state.grupoCompleto.grupoSanguineo.factor === "Positivo (+)" ? this.opcionTipoCelulasPositivas : this.opcionTipoCelulasNegativas}
											onChange={(e, { value }) => {
												this.setState({ celula1: value });
											}}
										/>
									</Segment>
									<Segment>
										<Header as="h5">Celula No.2</Header>
										<Dropdown
											className="modal-input-30p"
											name="celula2"
											text={this.state.celula2 === null ? "Seleccionar Célula" : this.state.celula2}
											item
											selection
											options={this.state.grupoCompleto.grupoSanguineo.factor === "Positivo (+)" ? this.opcionTipoCelulasPositivas : this.opcionTipoCelulasNegativas}
											onChange={(e, { value }) => {
												this.setState({ celula2: value });
											}}
										/>
									</Segment>
									<Segment>
										<Header as="h5">Celula No.3</Header>
										<Dropdown
											className="modal-input-30p"
											name="celula3"
											text={this.state.celula3 === null ? "Seleccionar Célula" : this.state.celula3}
											item
											selection
											options={this.state.grupoCompleto.grupoSanguineo.factor === "Positivo (+)" ? this.opcionTipoCelulasPositivas : this.opcionTipoCelulasNegativas}
											onChange={(e, { value }) => {
												this.setState({ celula3: value });
											}}
										/>
									</Segment>
								</Segment.Group>
								<Segment>
									<Label size="large">Pruebas: </Label>
									<Table compact celled definition attached="top">
										<Table.Header className="div-table-header">
											<Table.Row>
												<Table.HeaderCell />
												<Table.HeaderCell>Tipo de Célula</Table.HeaderCell>
												<Table.HeaderCell>
													<Label size="large" color="teal">
														Coombs
													</Label>
												</Table.HeaderCell>
												<Table.HeaderCell>
													<Label size="large" color="blue">
														Salina 4 Grados
													</Label>
												</Table.HeaderCell>
												<Table.HeaderCell>
													<Label size="large" color="violet">
														Salina 37 Grados
													</Label>
												</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											<Table.Row>
												<Table.Cell collapsing>
													<Icon name="syringe" />
												</Table.Cell>
												<Table.Cell>{this.state.celula1 != null ? this.state.celula1 + ":" : "Indefinido"}</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="cresultadocelula1"
														text={this.state.cresultadocelula1 === null ? "Seleccionar Resultado" : this.state.cresultadocelula1}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ cresultadocelula1: value });
														}}
														disabled={this.state.celula1 === null}
													/>
												</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="ps4resultadocelula1"
														text={this.state.ps4resultadocelula1 === null ? "Seleccionar Resultado" : this.state.ps4resultadocelula1}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ ps4resultadocelula1: value });
														}}
														disabled={this.state.celula1 === null}
													/>
												</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="ps37resultadocelula1"
														text={this.state.ps37resultadocelula1 === null ? "Seleccionar Resultado" : this.state.ps37resultadocelula1}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ ps37resultadocelula1: value });
														}}
														disabled={this.state.celula1 === null}
													/>
												</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell collapsing>
													<Icon name="syringe" />
												</Table.Cell>
												<Table.Cell>{this.state.celula2 != null ? this.state.celula2 + ":" : "Indefinido"}</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="cresultadocelula2"
														text={this.state.cresultadocelula2 === null ? "Seleccionar Resultado" : this.state.cresultadocelula2}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ cresultadocelula2: value });
														}}
														disabled={this.state.celula2 === null}
													/>
												</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="ps4resultadocelula2"
														text={this.state.ps4resultadocelula2 === null ? "Seleccionar Resultado" : this.state.ps4resultadocelula2}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ ps4resultadocelula2: value });
														}}
														disabled={this.state.celula2 === null}
													/>
												</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="ps37resultadocelula2"
														text={this.state.ps37resultadocelula2 === null ? "Seleccionar Resultado" : this.state.ps37resultadocelula2}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ ps37resultadocelula2: value });
														}}
														disabled={this.state.celula2 === null}
													/>
												</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell collapsing>
													<Icon name="syringe" />
												</Table.Cell>
												<Table.Cell>{this.state.celula3 != null ? this.state.celula3 + ":" : "Indefinido"}</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="cresultadocelula3"
														text={this.state.cresultadocelula3 === null ? "Seleccionar Resultado" : this.state.cresultadocelula3}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ cresultadocelula3: value });
														}}
														disabled={this.state.celula3 === null}
													/>
												</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="ps4resultadocelula3"
														text={this.state.ps4resultadocelula3 === null ? "Seleccionar Resultado" : this.state.ps4resultadocelula3}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ ps4resultadocelula3: value });
														}}
														disabled={this.state.celula3 === null}
													/>
												</Table.Cell>
												<Table.Cell>
													<Dropdown
														name="ps37resultadocelula3"
														text={this.state.ps37resultadocelula3 === null ? "Seleccionar Resultado" : this.state.ps37resultadocelula3}
														item
														selection
														options={this.opcionResultados}
														onChange={(e, { value }) => {
															this.setState({ ps37resultadocelula3: value });
														}}
														disabled={this.state.celula3 === null}
													/>
												</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell collapsing>
													<Icon name="syringe" />
												</Table.Cell>
												<Table.Cell>Resultado:</Table.Cell>
												<Table.Cell>
													<Form.Checkbox
														toggle
														name="cresultadofinal"
														labelPosition="left"
														label={this.state.cresultadofinal === true ? "Positivo (+)" : "Negativo (-)"}
														value={this.state.cresultadofinal}
														checked={this.state.cresultadofinal}
														onChange={(evt) => {
															evt.preventDefault();
															this.setState({
																cresultadofinal: !this.state.cresultadofinal,
															});
														}}
													/>
												</Table.Cell>
												<Table.Cell>
													<Form.Checkbox
														toggle
														name="ps4resultadofinal"
														labelPosition="left"
														label={this.state.ps4resultadofinal === true ? "Positivo (+)" : "Negativo (-)"}
														value={this.state.ps4resultadofinal}
														checked={this.state.ps4resultadofinal}
														onChange={(evt) => {
															evt.preventDefault();
															this.setState({
																ps4resultadofinal: !this.state.ps4resultadofinal,
															});
														}}
													/>
												</Table.Cell>
												<Table.Cell>
													<Form.Checkbox
														toggle
														name="ps37resultadofinal"
														labelPosition="left"
														label={this.state.ps37resultadofinal === true ? "Positivo (+)" : "Negativo (-)"}
														value={this.state.ps37resultadofinal}
														checked={this.state.ps37resultadofinal}
														onChange={(evt) => {
															evt.preventDefault();
															this.setState({
																ps37resultadofinal: !this.state.ps37resultadofinal,
															});
														}}
													/>
												</Table.Cell>
											</Table.Row>
										</Table.Body>
									</Table>
								</Segment>
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
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.grupokey || !this.Validar()}>
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
export default ComponentIdentificacionAnticuerpo;
//#endregion
