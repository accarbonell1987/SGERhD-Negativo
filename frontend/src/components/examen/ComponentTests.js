//#region Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Checkbox, Step } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentAddTest from "./ComponentAddTest";
import ComponentModalAnalisis from "../analisis/ComponentModalAnalisis";
import ComponentUpdateTest from "./ComponentUpdateTest";
// import ComponentSeePatient from "../paciente/ComponentSeePatient";
//#endregion

//#region Defincion de la clase
class ComponentTests extends Component {
	//#region Constructor
	constructor(props) {
		super(props);

		this.DeleteTest = this.DeleteTest.bind(this);
	}
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
	DeleteTest = (test) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			//Esta seguro?
			let { text, accion } = "";
			if (test.activo) accion = "Desactivar";
			else accion = "Eliminar";
			text = "Desea " + accion + " el examen";

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
					fetch(this.props.global.endpoint + "api/examen/" + test._id, {
						method: "PUT",
						body: JSON.stringify(test),
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
		if (allow) return <ComponentAddTest Deslogin={this.props.Deslogin} middleButtonAdd={middleButtonAdd} global={this.props.global} pacientes={this.props.pacientes} embarazos={this.props.embarazos} examenes={this.props.examenes} pruebas={this.props.pruebas} paciente={this.props.paciente} embarazo={this.props.embarazo} GetDataFromServer={this.props.GetDataFromServer} />;
		else
			return (
				<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
					<Icon name="add circle" />
					Adicionar
				</Button>
			);
	};
	BelongTo = (examen) => {
		const icontipo = examen.tipo === "Embarazo" ? "heartbeat" : "wheelchair";
		return (
			<Step.Group size="mini">
				<Step>
					<Icon name={icontipo} />
					<Step.Content>
						<Step.Title>{examen.tipo}</Step.Title>
					</Step.Content>
				</Step>
				{examen.tipo === "Embarazo" ? (
					<Step active>
						<Step.Content>
							<Step.Title>{examen.embarazo.tipo}</Step.Title>
						</Step.Content>
					</Step>
				) : (
					<Step active>
						<Step.Content>
							<Step.Title>{examen.paciente.nombre}</Step.Title>
						</Step.Content>
					</Step>
				)}
			</Step.Group>
		);
	};
	DetailsOfTests = (examen) => {
		if (examen.tipo === "Embarazo") {
			const embarazo = examen.embarazo;
			if (embarazo.tipo === "Nuevo") {
				const { semanas, dias } = JSON.parse(examen.tiempoDeGestacion);
				return (
					<Label.Group className="button-pregnancy-separate">
						Tiempo de Gestación:{" "}
						<Button as="div" labelPosition="right" className="button-pregnancy">
							<Button icon>
								<Icon name="calendar alternate outline" />
								Semanas:
							</Button>
							<Label basic pointing="left">
								{semanas}
							</Label>
						</Button>
						<Button as="div" labelPosition="right" className="button-pregnancy">
							<Button icon>
								<Icon name="calendar alternate" />
								Dias:
							</Button>
							<Label basic pointing="left">
								{dias}
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
		} else {
			return "Sin Detalles";
		}
	};
	//#endregion

	//#region Render
	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "examenes");
		const classNameTable = this.props.detail ? "div-table-detail" : "div-table";
		//chequear si es examen y tengo permiso
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					{!this.props.detail ? (
						<Label attached="top left" className="div-label-attached" size="large">
							<Icon name="clipboard list" size="large" inverted /> Gestión de Exámenes
						</Label>
					) : (
						""
					)}
					{this.props.examenes.length > 0 ? (
						<Table compact celled definition attached="top" className={classNameTable}>
							<Table.Header className="div-table-header">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell colSpan="7">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Fecha</Table.HeaderCell>
									<Table.HeaderCell>Observaciones</Table.HeaderCell>
									<Table.HeaderCell>Detalles</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Pertenece</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Pruebas</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{this.props.examenes.map((examen) => {
									let negative = !examen.activo;
									let fechacadena = moment(new Date(examen.fecha)).format("DD-MM-YYYY");
									return (
										<Table.Row key={examen._id} negative={negative}>
											<Table.Cell collapsing>
												<Icon name="clipboard list" />
											</Table.Cell>
											<Table.Cell collapsing>{fechacadena}</Table.Cell>
											<Table.Cell>{examen.observaciones}</Table.Cell>
											<Table.Cell>{this.DetailsOfTests(examen)}</Table.Cell>
											<Table.Cell>{this.BelongTo(examen)}</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentModalAnalisis Deslogin={this.props.Deslogin} global={this.props.global} examenes={this.props.examenes} examen={examen} GetDataFromServer={this.props.GetDataFromServer} cambiarIcono={true} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="activo" labelPosition="left" label={examen.activo ? "Si" : "No"} checked={examen.activo} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.DeleteTest(examen)} /> : <Button icon="remove circle" className="button-remove" disabled />}
												{accesomenu.permisos.modificar ? <ComponentUpdateTest Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} global={this.props.global} pacientes={this.props.pacientes} embarazos={this.props.embarazos} examenes={this.props.examenes} pruebas={this.props.pruebas} examen={examen} /> : <Button icon="edit" disabled />}
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
export default ComponentTests;
//#endregion
