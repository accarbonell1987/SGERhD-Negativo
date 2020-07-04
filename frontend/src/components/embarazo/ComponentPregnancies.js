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
import ComponentAddPregnancy from "./ComponentAddPregnancy";
import ComponentUpdatePregnancy from "./ComponentUpdatePregnancy";
import ComponentCompletePregnancy from "./ComponentCompletePregnancy";
import ComponentSeePatient from "../paciente/ComponentSeePatient";
import ComponentModalTest from "../examen/ComponentModalTest";
//#endregion

//#region Defincion de la clase
class ComponentPregnancies extends Component {
	//#region Constructor
	constructor(props) {
		super(props);

		this.DeletePregnancy = this.DeletePregnancy.bind(this);
		this.Search = this.Search.bind(this);
		this.OnPressEnter = this.OnPressEnter.bind(this);
	}

	state = { embarazos: null, criteriobusqueda: "" };
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
	DeletePregnancy = (pregnancy) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			//Esta seguro?
			let { text, accion } = "";
			if (pregnancy.activo) accion = "Desactivar";
			else accion = "Eliminar";
			text = "Desea " + accion + " el embarazo perteneciente al paciente: " + pregnancy.paciente.nombre + " " + pregnancy.paciente.apellidos;

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
					fetch(this.props.global.endpoint + "api/embarazo/" + pregnancy._id, {
						method: "PUT",
						body: JSON.stringify(pregnancy),
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
							//recargar
							this.props.GetDataFromServer();
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
		}
	};
	CheckAndAllowAddButton = (middleButtonAdd, allow) => {
		if (allow) return <ComponentAddPregnancy Deslogin={this.props.Deslogin} middleButtonAdd={middleButtonAdd} global={this.props.global} pacientes={this.props.pacientes} GetDataFromServer={this.props.GetDataFromServer} paciente={this.props.paciente} />;
		else
			return (
				<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
					<Icon name="add circle" />
					Adicionar
				</Button>
			);
	};
	DetailFromType = (embarazo) => {
		if (embarazo.tipo === "Nuevo") {
			return (
				<Label.Group className="button-pregnancy-separate">
					Tiempo de Gestación:{" "}
					<Button as="div" labelPosition="right" className="button-pregnancy">
						<Button icon>
							<Icon name="calendar alternate outline" />
							Semanas:
						</Button>
						<Label basic pointing="left">
							{embarazo.semanas}
						</Label>
					</Button>
					<Button as="div" labelPosition="right" className="button-pregnancy">
						<Button icon>
							<Icon name="calendar alternate" />
							Dias:
						</Button>
						<Label basic pointing="left">
							{embarazo.dias}
						</Label>
					</Button>
				</Label.Group>
			);
		} else {
			return (
				<Label.Group className="button-pregnancy-separate">
					<Button as="div" labelPosition="right" className="button-pregnancy">
						<Button icon>
							<Icon name="heartbeat" />
							Fin de Embarazo:
						</Button>
						<Label basic pointing="left">
							{embarazo.findeembarazo}
						</Label>
					</Button>
					<Button as="div" labelPosition="right" className="button-pregnancy">
						<Button icon>
							<Icon name={embarazo.findeembarazo === "Parto" ? "birthday cake" : "user md"} />
							{embarazo.findeembarazo === "Parto" ? "Modo de Parto: " : "Modo de Aborto: "}
						</Button>
						<Label basic pointing="left">
							{embarazo.findeembarazo === "Parto" ? embarazo.findeparto : embarazo.findeaborto}
						</Label>
					</Button>
				</Label.Group>
			);
		}
	};
	Search = (evt) => {
		const { value } = evt.target;
		let embarazos = [];
		let criteriobusqueda = value;

		if (criteriobusqueda !== "") {
			embarazos = this.props.embarazos.filter((p) => p.fecha.includes(value) || p.paciente.nombre.includes(value) || p.paciente.apellidos.includes(value) || p.observaciones.includes(value) || p.tipo.includes(value));
			this.setState({
				embarazos: embarazos,
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
		const accesomenu = permiso.accesos.find((p) => p.opcion === "embarazos");
		const classNameTable = this.props.detail ? "div-table-detail" : "div-table";
		let embarazos = this.props.embarazos;
		if (this.state.criteriobusqueda !== "") embarazos = this.state.embarazos;
		//chequear si es embarazos y tengo permiso
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					{!this.props.detail ? (
						<Label attached="top left" className="div-label-attached" size="large">
							<Icon name="heartbeat" size="large" inverted /> Gestión de Embarazos
						</Label>
					) : (
						""
					)}
					{this.props.embarazos.length > 0 ? <Input name="buscar" value={this.state.criteriobusqueda} icon={<Icon name="search" inverted circular link onClick={this.Search} />} placeholder="Buscar..." onChange={this.Search} onKeyDown={this.OnPressEnter} /> : ""}
					{embarazos.length > 0 ? (
						<Table compact celled definition attached="top" className={classNameTable}>
							<Table.Header className="div-table-header">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell colSpan="8">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Fecha de Concepción</Table.HeaderCell>
									<Table.HeaderCell>Tipo</Table.HeaderCell>
									<Table.HeaderCell>Observaciones</Table.HeaderCell>
									<Table.HeaderCell>Detalles</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Exámenes</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Paciente</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{embarazos.map((embarazo) => {
									let negative = !embarazo.activo;
									let fechacadena = moment(new Date(embarazo.fecha)).format("DD-MM-YYYY");
									const colorTipo = embarazo.tipo === "Nuevo" ? "teal" : "violet";
									return (
										<Table.Row key={embarazo._id} negative={negative}>
											<Table.Cell collapsing>
												<Icon name="tint" />
											</Table.Cell>
											<Table.Cell>{fechacadena}</Table.Cell>
											<Table.Cell>
												<Label size="large" color={colorTipo}>
													{embarazo.tipo}
												</Label>
											</Table.Cell>
											<Table.Cell>{embarazo.observaciones}</Table.Cell>
											<Table.Cell>{this.DetailFromType(embarazo)}</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentModalTest Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.props.pacientes} embarazos={this.props.embarazos} examenes={embarazo.examenes} embarazo={embarazo} GetDataFromServer={this.props.GetDataFromServer} cambiarIcono={true} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentSeePatient Deslogin={this.props.Deslogin} paciente={embarazo.paciente} global={this.props.global} pacientes={this.props.pacientes} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="activo" labelPosition="left" label={embarazo.activo ? "Si" : "No"} checked={embarazo.activo} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.DeletePregnancy(embarazo)} /> : <Button icon="remove circle" className="button-remove" disabled />}
												{accesomenu.permisos.modificar ? <ComponentUpdatePregnancy Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} global={this.props.global} pacientes={this.props.pacientes} pregnancy={embarazo} /> : <Button icon="edit" disabled />}
												{accesomenu.permisos.modificar && embarazo.tipo === "Nuevo" ? <ComponentCompletePregnancy Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} global={this.props.global} pacientes={this.props.pacientes} pregnancy={embarazo} /> : <Button icon="checkmark" disabled />}
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
export default ComponentPregnancies;
//#endregion
