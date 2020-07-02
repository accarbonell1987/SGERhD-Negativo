//#region Importaciones
import React, { Component } from "react";
import { Header, Form, Segment, Modal, Message, Icon, Button, Table, Label } from "semantic-ui-react";
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
		key: null,
		pesquizajeAnticuerpo: null,
		opcionPesquizajeAnticuerpo: null,
		errorform: false,

		coombsanticuerpo: null,
		coombssinespecificidad: null,
		coombsmezclaanticuerpo: null,
		salina4anticuerpo: null,
		salina4sinespecificidad: null,
		salina4mezclaanticuerpo: null,
		salina37anticuerpo: null,
		salina37sinespecificidad: null,
		salina37mezclaanticuerpo: null,
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
			const detail = this.props.analisis.identificacionAnticuerpo;

			const coombs = detail.pCoombsIndirecto ? JSON.parse(detail.pCoombsIndirecto) : null;
			const salina4g = detail.pSalina4g ? JSON.parse(detail.pSalina4g) : null;
			const salina37g = detail.pSalina37g ? JSON.parse(detail.pSalina37g) : null;

			let opcion = [];
			let pesquizajeAnticuerpo = null;
			this.props.pesquizajesAnticuerpo.forEach((e) => {
				let fechacadena = moment(new Date(e.fecha)).format("DD-MM-YYYY");
				let datos = "Prueba - Fecha: " + fechacadena + ", Número de Muestra: " + e.numeroMuestra;
				let cur = {
					key: e._id,
					text: datos,
					value: e._id,
					icon: "syringe",
				};
				// pesquizajeAnticuerpo = e.numeroMuestra === detail.referenciaPesquizaje;
				opcion = [...opcion, cur];
			});
			if (detail.referenciaPesquizaje != null) pesquizajeAnticuerpo = this.props.pesquizajesAnticuerpo.find((p) => p.numeroMuestra === detail.referenciaPesquizaje);

			//actualizar los states
			this.setState({
				openModal: false,
				key: null,
				pesquizajeAnticuerpo: pesquizajeAnticuerpo,
				opcionPesquizajeAnticuerpo: opcion,
				errorform: false,
				coombsanticuerpo: coombs != null ? coombs.anticuerpos : "",
				coombssinespecificidad: coombs != null ? coombs.sinespecificidad : false,
				coombsmezclaanticuerpo: coombs != null ? coombs.mezclaanticuerpo : false,
				salina4anticuerpo: salina4g != null ? salina4g.anticuerpos : "",
				salina4sinespecificidad: salina4g != null ? salina4g.sinespecificidad : false,
				salina4mezclaanticuerpo: salina4g != null ? salina4g.mezclaanticuerpo : false,
				salina37anticuerpo: salina37g != null ? salina37g.anticuerpos : "",
				salina37sinespecificidad: salina37g != null ? salina37g.sinespecificidad : false,
				salina37mezclaanticuerpo: salina37g != null ? salina37g.mezclaanticuerpo : false,
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

			const pCoombsIndirecto = JSON.stringify({ anticuerpos: this.state.coombsanticuerpo, sinespecificidad: this.state.coombssinespecificidad, mezclaanticuerpo: this.state.coombsmezclaanticuerpo });
			const pSalina4g = JSON.stringify({ anticuerpos: this.state.salina4anticuerpo, sinespecificidad: this.state.salina4sinespecificidad, mezclaanticuerpo: this.state.salina4mezclaanticuerpo });
			const pSalina37g = JSON.stringify({ anticuerpos: this.state.salina37anticuerpo, sinespecificidad: this.state.salina37sinespecificidad, mezclaanticuerpo: this.state.salina37mezclaanticuerpo });

			let detail = this.props.analisis.identificacionAnticuerpo;
			detail.pCoombsIndirecto = pCoombsIndirecto;
			detail.pSalina4g = pSalina4g;
			detail.pSalina37g = pSalina37g;
			detail.referenciaPesquizaje = this.state.pesquizajeAnticuerpo.numeroMuestra;
			console.log(detail);

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
	//#endregion

	//#region Render
	render() {
		let { resultadoCoombs, resultadoSalina4, resultadoSalina37 } = false;
		if (this.state.pesquizajeAnticuerpo != null) {
			const pesquizaje = this.state.pesquizajeAnticuerpo;
			const coombs = pesquizaje.pCoombsIndirecto ? JSON.parse(pesquizaje.pCoombsIndirecto) : null;
			const salina4g = pesquizaje.pSalina4g ? JSON.parse(pesquizaje.pSalina4g) : null;
			const salina37g = pesquizaje.pSalina37g ? JSON.parse(pesquizaje.pSalina37g) : null;

			resultadoCoombs = coombs != null ? coombs.resultadofinal : false;
			resultadoSalina4 = salina4g != null ? salina4g.resultadofinal : false;
			resultadoSalina37 = salina37g != null ? salina37g.resultadofinal : false;
		}
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
							name="pPesquizajeAnticuerpo"
							label="Prueba Pesquizaje Anticuerpo:"
							placeholder="Seleccionar Prueba"
							options={this.state.opcionPesquizajeAnticuerpo}
							value={this.state.key}
							onChange={(e, { value }) => {
								const analisis = this.props.pesquizajesAnticuerpo.find((e) => e._id === value);
								this.setState({ key: value, pesquizajeAnticuerpo: analisis.pesquizajeAnticuerpo });
							}}
							fluid
							selection
						/>
						{this.state.key != null ? (
							<Segment>
								<Label size="large">Pruebas: </Label>
								<Table compact celled definition attached="top">
									<Table.Header className="div-table-header">
										<Table.Row>
											<Table.HeaderCell />
											<Table.HeaderCell>
												<Label size="large" color="teal">
													Coombs
												</Label>
												{resultadoCoombs ? (
													<Label size="large" color="red">
														{"(+)"}
													</Label>
												) : (
													<Label color="black">{"(-)"}</Label>
												)}
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Label size="large" color="blue">
													Salina 4 Grados
												</Label>
												{resultadoSalina4 ? (
													<Label size="large" color="red">
														{" (+)"}
													</Label>
												) : (
													<Label color="black">{" (-)"}</Label>
												)}
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Label size="large" color="violet">
													Salina 37 Grados
												</Label>
												{resultadoSalina37 ? (
													<Label size="large" color="red">
														{" (+)"}
													</Label>
												) : (
													<Label color="black">{" (-)"}</Label>
												)}
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										<Table.Row>
											<Table.Cell collapsing>
												<Icon name="syringe" />
											</Table.Cell>
											<Table.Cell>
												<Form.Input name="coombsanticuerpo" icon="eye dropper" iconPosition="left" label="Anticuerpos:" value={this.state.coombsanticuerpo} placeholder="Escribir..." onChange={this.ChangeModalInput} onKeyDown={this.OnPressEnter} disabled={!resultadoCoombs} />
											</Table.Cell>
											<Table.Cell>
												<Form.Input name="salina4anticuerpo" icon="eye dropper" iconPosition="left" label="Anticuerpos:" value={this.state.salina4anticuerpo} placeholder="Escribir..." onChange={this.ChangeModalInput} onKeyDown={this.OnPressEnter} disabled={!resultadoSalina4} />
											</Table.Cell>
											<Table.Cell>
												<Form.Input name="salina37anticuerpo" icon="eye dropper" iconPosition="left" label="Anticuerpos:" value={this.state.salina37anticuerpo} placeholder="Escribir..." onChange={this.ChangeModalInput} onKeyDown={this.OnPressEnter} disabled={!resultadoSalina37} />
											</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell collapsing>
												<Icon name="syringe" />
											</Table.Cell>
											<Table.Cell>
												Sin Especificidad:{" "}
												<Form.Checkbox
													disabled={!resultadoCoombs}
													toggle
													name="coombssinespecificidad"
													labelPosition="left"
													label={this.state.coombssinespecificidad === true ? "Si" : "No"}
													value={this.state.coombssinespecificidad}
													checked={this.state.coombssinespecificidad}
													onChange={(evt) => {
														evt.preventDefault();
														this.setState({
															coombssinespecificidad: !this.state.coombssinespecificidad,
														});
													}}
												/>
											</Table.Cell>
											<Table.Cell>
												Sin Especificidad:{" "}
												<Form.Checkbox
													disabled={!resultadoSalina4}
													toggle
													name="salina4sinespecificidad"
													labelPosition="left"
													label={this.state.salina4sinespecificidad === true ? "Si" : "No"}
													value={this.state.salina4sinespecificidad}
													checked={this.state.salina4sinespecificidad}
													onChange={(evt) => {
														evt.preventDefault();
														this.setState({
															salina4sinespecificidad: !this.state.salina4sinespecificidad,
														});
													}}
												/>
											</Table.Cell>
											<Table.Cell>
												Sin Especificidad:{" "}
												<Form.Checkbox
													disabled={!resultadoSalina37}
													toggle
													name="salina37sinespecificidad"
													labelPosition="left"
													label={this.state.salina37sinespecificidad === true ? "Si" : "No"}
													value={this.state.salina37sinespecificidad}
													checked={this.state.salina37sinespecificidad}
													onChange={(evt) => {
														evt.preventDefault();
														this.setState({
															salina37sinespecificidad: !this.state.salina37sinespecificidad,
														});
													}}
												/>
											</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell collapsing>
												<Icon name="syringe" />
											</Table.Cell>
											<Table.Cell>
												Mezcla Anticuerpo:{" "}
												<Form.Checkbox
													disabled={!resultadoCoombs}
													toggle
													name="coombsmezclaanticuerpo"
													labelPosition="left"
													label={this.state.coombsmezclaanticuerpo === true ? "Si" : "No"}
													value={this.state.coombsmezclaanticuerpo}
													checked={this.state.coombsmezclaanticuerpo}
													onChange={(evt) => {
														evt.preventDefault();
														this.setState({
															coombsmezclaanticuerpo: !this.state.coombsmezclaanticuerpo,
														});
													}}
												/>
											</Table.Cell>
											<Table.Cell>
												Mezcla Anticuerpo:{" "}
												<Form.Checkbox
													disabled={!resultadoSalina4}
													toggle
													name="salina4mezclaanticuerpo"
													labelPosition="left"
													label={this.state.salina4mezclaanticuerpo === true ? "Si" : "No"}
													value={this.state.salina4mezclaanticuerpo}
													checked={this.state.salina4mezclaanticuerpo}
													onChange={(evt) => {
														evt.preventDefault();
														this.setState({
															salina4mezclaanticuerpo: !this.state.salina4mezclaanticuerpo,
														});
													}}
												/>
											</Table.Cell>
											<Table.Cell>
												Mezcla Anticuerpo:{" "}
												<Form.Checkbox
													disabled={!resultadoSalina37}
													toggle
													name="salina37mezclaanticuerpo"
													labelPosition="left"
													label={this.state.salina37mezclaanticuerpo === true ? "Si" : "No"}
													value={this.state.salina37mezclaanticuerpo}
													checked={this.state.salina37mezclaanticuerpo}
													onChange={(evt) => {
														evt.preventDefault();
														this.setState({
															salina37mezclaanticuerpo: !this.state.salina37mezclaanticuerpo,
														});
													}}
												/>
											</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table>
							</Segment>
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
					<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type="submit" disabled={!this.state.key}>
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
