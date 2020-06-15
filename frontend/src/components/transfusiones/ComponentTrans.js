//#region Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Checkbox } from "semantic-ui-react";
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

		this.deleteTran = this.deleteTran.bind(this);
	}
	//#endregion

	//#region Metodos y Eventos
	deleteTran = (tran) => {
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
			confirmButtonText: "Si, Eliminar",
			reverseButtons: true,
		}).then((result) => {
			//si escogio Si
			if (result.value) {
				//enviar al endpoint
				fetch(this.props.parentState.endpoint + "api/transfusion/" + tran._id, {
					method: "PUT",
					body: JSON.stringify(tran),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"access-token": this.props.parentState.token,
					},
				})
					.then((res) => res.json())
					.then((data) => {
						const { status, message } = data;
						//chequear el mensaje
						status === 200 ? Swal.fire({ position: "center", icon: "success", title: message, showConfirmButton: false, timer: 3000 }) : Swal.fire({ position: "center", icon: "error", title: message, showConfirmButton: false, timer: 5000 });

						//recargar
						this.props.reloadFromServer();
					})
					.catch((err) => {
						Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 });
					});
			}
		});
	};
	checkAddAllowAndReturnButton = (middleButtonAdd, allow) => {
		if (allow) return <ComponentAddTran middleButtonAdd={middleButtonAdd} parentState={this.props.parentState} roles={this.props.roles} pacientes={this.props.pacientes} reloadFromServer={this.props.reloadFromServer} paciente={this.props.paciente} />;
		else
			return (
				<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
					<Icon name="add circle" />
					Adicionar
				</Button>
			);
	};
	//#endregion

	//#region Render
	render() {
		//buscar el permiso del rol
		const permiso = this.props.permisos.find((p) => p.rol === this.props.parentState.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "transfusiones");
		const classNameTable = this.props.detail ? "div-table-detail" : "div-table";
		//chequear si es transfusiones y tengo permiso
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
					{this.props.transfusiones.length > 0 ? (
						<Table compact celled definition attached="top" className={classNameTable}>
							<Table.Header className="div-table-header">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell colSpan="7">{this.checkAddAllowAndReturnButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Fecha</Table.HeaderCell>
									<Table.HeaderCell>Reacción Adversa</Table.HeaderCell>
									<Table.HeaderCell>Observaciones</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Paciente</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{this.props.transfusiones.map((tran) => {
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
											<Table.Cell>{tran.observaciones}</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentSeePatient paciente={tran.paciente} parentState={this.props.parentState} roles={this.props.roles} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="activo" labelPosition="left" label={tran.activo ? "Si" : "No"} checked={tran.activo} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.deleteTran(tran)} /> : <Button icon="remove circle" className="button-remove" disabled />}
												{accesomenu.permisos.modificar ? <ComponentUpdateTran reloadFromServer={this.props.reloadFromServer} parentState={this.props.parentState} roles={this.props.roles} pacientes={this.props.pacientes} tran={tran} /> : <Button icon="edit" disabled />}
											</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>
						</Table>
					) : (
						this.checkAddAllowAndReturnButton(this.props.middleButtonAdd, accesomenu.permisos.crear)
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
