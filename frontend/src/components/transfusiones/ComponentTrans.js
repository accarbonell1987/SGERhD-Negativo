//#region Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Checkbox, Input } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentAddTran from "./ComponentAddTran";
import ComponentUpdateTran from "./ComponentUpdateTran";
import ComponentSeePatient from "../paciente/ComponentSeePatient";
//#endregion

//#region Defincion de la clase
class ComponentTrans extends Component {
	//#region Constructor
	constructor(props) {
		super(props);

		this.DeleteTran = this.DeleteTran.bind(this);
		this.Search = this.Search.bind(this);
		this.OnPressEnter = this.OnPressEnter.bind(this);
	}

	state = { transfusiones: null, criteriobusqueda: "" };
	//#endregion

	//#region Metodos y Eventos
	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	DeleteTran = (tran) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			//Esta seguro?
			let { text, accion } = "";
			if (tran.activo) accion = "Desactivar";
			else accion = "Eliminar";
			text = "Desea " + accion + " la transfusion perteneciente al paciente: " + tran.paciente.nombre + " " + tran.paciente.apellidos;

			Swal.fire({
				title: "¿Esta seguro?",
				text: text,
				icon: "question",
				showCancelButton: true,
				cancelButtonColor: "#db2828",
				confirmButtonColor: "#21ba45",
				confirmButtonText: "Si, " + accion,
				reverseButtons: true,
			}).then((result) => {
				//si escogio Si
				if (result.value) {
					//enviar al endpoint
					fetch(this.props.global.endpoint + "api/transfusion/" + tran._id, {
						method: "PUT",
						body: JSON.stringify(tran),
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"access-token": data.token,
						},
					})
						.then((res) => res.json())
						.then((serverdata) => {
							const { status, message } = serverdata;
							//chequear el mensaje
							status === 200 ? Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 3000 }) : Swal.fire({ position: "center", icon: "error", title: message, showConfirmButton: false, timer: 5000 });

							//recargar
							this.props.GetDataFromServer();
						})
						.catch((err) => {
							Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 });
						});
				}
			});
		}
	};
	CheckAndAllowAddButton = (middleButtonAdd, allow) => {
		if (allow) return <ComponentAddTran middleButtonAdd={middleButtonAdd} Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.props.pacientes} GetDataFromServer={this.props.GetDataFromServer} paciente={this.props.paciente} />;
		else
			return (
				<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
					<Icon name="add circle" />
					Adicionar
				</Button>
			);
	};
	AdvReactionDetails = (tran) => {
		if (tran.reaccionAdversa) {
			let detalles = "";
			// fiebre, vomito, escalofrio, rasch, prurito, dolorcabeza, mareo, ictero, hemorragia
			const detallesArr = ["Fiebre", "Vómito", "Escalofrío", "Rasch", "Prurito", "Dolor de Cabeza", "Mareo", "Íctero", "Hemorragia"];
			const reaccionAdversaDetalles = JSON.parse(tran.reaccionAdversaDetalles);
			detalles += reaccionAdversaDetalles.fiebre ? (detalles.length > 0 ? ", " + detallesArr[0] : detallesArr[0]) : "";
			detalles += reaccionAdversaDetalles.vomito ? (detalles.length > 0 ? ", " + detallesArr[1] : detallesArr[1]) : "";
			detalles += reaccionAdversaDetalles.escalofrio ? (detalles.length > 0 ? ", " + detallesArr[2] : detallesArr[2]) : "";
			detalles += reaccionAdversaDetalles.rasch ? (detalles.length > 0 ? ", " + detallesArr[3] : detallesArr[3]) : "";
			detalles += reaccionAdversaDetalles.prurito ? (detalles.length > 0 ? ", " + detallesArr[4] : detallesArr[4]) : "";
			detalles += reaccionAdversaDetalles.dolorcabeza ? (detalles.length > 0 ? ", " + detallesArr[5] : detallesArr[5]) : "";
			detalles += reaccionAdversaDetalles.mareo ? (detalles.length > 0 ? ", " + detallesArr[6] : detallesArr[6]) : "";
			detalles += reaccionAdversaDetalles.ictero ? (detalles.length > 0 ? ", " + detallesArr[7] : detallesArr[7]) : "";
			detalles += reaccionAdversaDetalles.hemorragia ? (detalles.length > 0 ? ", " + detallesArr[8] : detallesArr[8]) : "";
			return detalles;
		} else {
			return "Sin Detalles";
		}
	};
	Search = (evt) => {
		const { value } = evt.target;
		let transfusiones = [];
		let criteriobusqueda = value;

		if (criteriobusqueda !== "") {
			transfusiones = this.props.transfusiones.filter((p) => p.fecha.includes(value) || p.paciente.nombre.includes(value) || p.paciente.apellidos.includes(value) || p.observaciones.includes(value));
			this.setState({
				transfusiones: transfusiones,
				criteriobusqueda: criteriobusqueda,
			});
		}
		this.setState({
			criteriobusqueda: criteriobusqueda,
		});
	};
	OnPressEnter = (evt) => {
		if (evt.keyCode === 13 && !evt.shiftKey) {
			evt.preventDefault();
			this.Search(evt);
		}
	};
	//#endregion

	//#region Render
	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "transfusiones");
		const classNameTable = this.props.detail ? "div-table-detail" : "div-table";
		//chequear si es transfusiones y tengo permiso
		//para el buscar
		let transfusiones = this.props.transfusiones;
		if (this.state.criteriobusqueda !== "") transfusiones = this.state.transfusiones;
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					{!this.props.detail ? (
						<Label attached="top left" className="div-label-attached" size="large">
							<Icon name="tint" size="large" inverted /> Gestión de Transfusiones
						</Label>
					) : (
						""
					)}
					{this.props.transfusiones.length > 0 ? <Input name="buscar" value={this.state.criteriobusqueda} icon={<Icon name="search" inverted circular link onClick={this.Search} />} placeholder="Buscar..." onChange={this.Search} onKeyDown={this.OnPressEnter} /> : ""}
					{transfusiones.length > 0 ? (
						<Table compact celled definition attached="top" className={classNameTable}>
							<Table.Header className="div-table-header">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell colSpan="8">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Fecha</Table.HeaderCell>
									<Table.HeaderCell>Reacción Adversa</Table.HeaderCell>
									<Table.HeaderCell>Detalles</Table.HeaderCell>
									<Table.HeaderCell>Observaciones</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Paciente</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{transfusiones.map((tran) => {
									let negative = !tran.activo;
									let fechacadena = moment(new Date(tran.fecha)).format("DD-MM-YYYY");
									return (
										<Table.Row key={tran._id} negative={negative}>
											<Table.Cell collapsing>
												<Icon name="tint" />
											</Table.Cell>
											<Table.Cell>{fechacadena}</Table.Cell>
											<Table.Cell>
												<Checkbox toggle name="reaccionAdversa" labelPosition="left" checked={tran.reaccionAdversa} label={tran.reaccionAdversa ? "Si" : "No"} disabled />
											</Table.Cell>
											<Table.Cell>{this.AdvReactionDetails(tran)}</Table.Cell>
											<Table.Cell>{tran.observaciones}</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentSeePatient paciente={tran.paciente} global={this.props.global} roles={this.props.roles} pacientes={this.props.pacientes} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="activo" labelPosition="left" label={tran.activo ? "Si" : "No"} checked={tran.activo} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.DeleteTran(tran)} /> : <Button icon="remove circle" className="button-remove" disabled />}
												{accesomenu.permisos.modificar ? <ComponentUpdateTran Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} global={this.props.global} pacientes={this.props.pacientes} tran={tran} /> : <Button icon="edit" disabled />}
											</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>
						</Table>
					) : (
						this.CheckAndAllowAddButton(this.props.middleButtonAdd, accesomenu.permisos.crear)
					)}
				</Grid.Column>
			</Grid>
		);
	}
	//#endregion
}
//#endregion

//#region Export
export default ComponentTrans;
//#endregion
