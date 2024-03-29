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
import ComponentAddClinicHistory from "./ComponentAddClinicHistory";
import ComponentUpdateClinicHistory from "./ComponentUpdateClinicHistory";
import ComponentSeePatient from "../paciente/ComponentSeePatient";
//#endregion

//#region Defincion de la clase
class ComponentClinicHistory extends Component {
	//#region Constructor
	constructor(props) {
		super(props);

		this.deleteClinicHistory = this.deleteClinicHistory.bind(this);
	}
	//#endregion

	//#region Metodos y Eventos
	//eliminar el historia clinica
	deleteClinicHistory = (historia) => {
		//Esta seguro?
		let { text, accion } = "";
		if (historia.activo) accion = "Desactivar";
		else accion = "Eliminar";
		text = "Desea " + accion + " la historia clinica perteneciente al paciente: " + historia.paciente.nombre + " " + historia.paciente.apellidos;

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
				fetch(this.props.parentState.endpoint + "api/historiaclinica/" + historia._id, {
					method: "PUT",
					body: JSON.stringify(historia),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"access-token": this.props.parentState.token,
					},
				})
					.then((res) => res.json())
					.then((data) => {
						const { status, message } = data;
						//recargar todas las historias y todos los pacientes

						//chequear el mensaje
						status === 200
							? Swal.fire({
									position: "center",
									icon: "success",
									title: message,
									showConfirmButton: false,
									timer: 3000,
							  })
							: Swal.fire({
									position: "center",
									icon: "error",
									title: message,
									showConfirmButton: false,
									timer: 5000,
							  });

						this.props.reloadFromServer();
					})
					.catch((err) => {
						Swal.fire({
							position: "center",
							icon: "error",
							title: err,
							showConfirmButton: false,
							timer: 5000,
						});
					});
			}
		});
	};
	//#endregion

	//#region Render
	render() {
		//buscar el permiso del rol
		const permiso = this.props.permisos.find((p) => p.rol === this.props.parentState.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "historiaclinica");
		//chequear si es historiasclinica y tengo permiso
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					<Label attached="top left" className="div-label-attached" size="large">
						<Icon name="clipboard" size="large" inverted /> Gestión de Historias Clínicas
					</Label>
					<Table compact celled definition attached="top" className="div-table">
						<Table.Header className="div-table-header">
							<Table.Row>
								<Table.HeaderCell />
								<Table.HeaderCell colSpan="11">
									{accesomenu.permisos.crear ? (
										<ComponentAddClinicHistory reloadFromServer={this.props.reloadFromServer} parentState={this.props.parentState} roles={this.props.roles} pacientes={this.props.pacientes} historiasclinicas={this.props.historiasclinicas} permisos={this.props.permisos} />
									) : (
										<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
											<Icon name="add circle" />
											Adicionar
										</Button>
									)}
								</Table.HeaderCell>
							</Table.Row>
							{this.props.historiasclinicas.length > 0 ? (
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Fecha Creación</Table.HeaderCell>
									<Table.HeaderCell>Número</Table.HeaderCell>
									<Table.HeaderCell>Area de Salud</Table.HeaderCell>
									<Table.HeaderCell>Vacuna AntiD</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Embarazos</Table.HeaderCell>
									<Table.HeaderCell>Partos</Table.HeaderCell>
									<Table.HeaderCell>Abortos</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Paciente</Table.HeaderCell>
									<Table.HeaderCell>Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							) : (
								""
							)}
						</Table.Header>

						<Table.Body>
							{this.props.historiasclinicas.map((historia) => {
								let negative = !historia.activo;
								let fechacadena = moment(new Date(historia.fechaDeCreacion)).format("DD-MM-YYYY");

								return (
									<Table.Row key={historia._id} negative={negative}>
										<Table.Cell collapsing>
											<Icon name="clipboard" />
										</Table.Cell>
										<Table.Cell>{fechacadena}</Table.Cell>
										<Table.Cell>{historia.numerohistoria}</Table.Cell>
										<Table.Cell>{historia.areaDeSalud}</Table.Cell>
										<Table.Cell>
											<Checkbox toggle name="vacunaAntiD" labelPosition="left" checked={historia.vacunaAntiD} label={historia.vacunaAntiD ? "Si" : "No"} disabled />
										</Table.Cell>
										<Table.Cell className="cells-max-witdh-2">
											<Button icon labelPosition="right" className="button-childs">
												<Icon name="heartbeat" className="button-icon-childs" />
												{historia.numeroDeEmbarazos}
											</Button>
										</Table.Cell>
										<Table.Cell>{historia.numeroDePartos}</Table.Cell>
										<Table.Cell>{historia.numeroDeAbortos}</Table.Cell>
										<Table.Cell className="cells-max-witdh-2" collapsing>
											<ComponentSeePatient paciente={historia.paciente} parentState={this.props.parentState} roles={this.props.roles} />
										</Table.Cell>
										<Table.Cell className="cells-max-witdh-2" collapsing>
											<Checkbox toggle name="activo" labelPosition="left" label={historia.activo ? "Si" : "No"} checked={historia.activo} disabled />
										</Table.Cell>
										<Table.Cell className="cells-max-witdh-2" collapsing>
											{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.deleteClinicHistory(historia)} /> : <Button icon="remove circle" className="button-remove" disabled />}
											{accesomenu.permisos.modificar ? <ComponentUpdateClinicHistory reloadFromServer={this.props.reloadFromServer} historiaclinica={historia} parentState={this.props.parentState} roles={this.props.roles} pacientes={this.props.pacientes} historiasclinicas={this.props.historiasclinicas} /> : <Button icon="edit" disabled />}
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table>
				</Grid.Column>
			</Grid>
		);
	}
	//#endregion
}
//#endregion

//#region Export
export default ComponentClinicHistory;
//#endregion
