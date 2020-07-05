//#region Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Checkbox, Input } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentAddPatient from "./ComponentAddPatient";
import ComponentUpdatePatient from "./ComponentUpdatePatient";
import ComponentChilds from "./ComponentChilds";
import ComponentSeeClinicHistory from "../historiaclinica/ComponentSeeClinicHistory";
import ComponentModalTran from "../transfusiones/ComponentModalTrans";
import ComponentModalPregnancy from "../embarazo/ComponentModalPregnancy";
import ComponentModalTest from "../examen/ComponentModalTest";
import ComponentSeePatient from "./ComponentSeePatient";
//#endregion

//#region Defincion de la clase
class ComponentPatients extends Component {
	constructor(props) {
		super(props);

		this.DeletePatient = this.DeletePatient.bind(this);
		this.Search = this.Search.bind(this);
		this.OnPressEnter = this.OnPressEnter.bind(this);
	}

	state = { pacientes: null, criteriobusqueda: "" };

	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	//eliminar el paciente
	DeletePatient = (paciente) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			//Esta seguro?
			let { text, accion } = "";
			if (paciente.activo) accion = "Desactivar";
			else accion = "Eliminar";
			text = "Desea " + accion + " el paciente: " + paciente.nombre + " " + paciente.apellidos;

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
					fetch(this.props.global.endpoint + "api/paciente/" + paciente._id, {
						method: "PUT",
						body: JSON.stringify(paciente),
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"access-token": data.token,
						},
					})
						.then((res) => res.json())
						.then((serverdata) => {
							const { status, message } = serverdata;
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
		if (allow) return <ComponentAddPatient middleButtonAdd={middleButtonAdd} Deslogin={this.props.Deslogin} global={this.props.global} GetDataFromServer={this.props.GetDataFromServer} pacientes={this.props.pacientes} />;
		else
			return (
				<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
					<Icon name="add circle" />
					Adicionar
				</Button>
			);
	};
	CalcAge = (paciente) => {
		const nacimiento = paciente.ci.slice(0, 6);
		const now = new Date();

		const nowaño = now.getFullYear();
		const nowmes = now.getMonth() + 1;

		const año = nacimiento.slice(0, 2);
		const mes = nacimiento.slice(2, 4);
		// const dia = nacimiento.slice(4, 2);

		var confecaño = 0;
		if (año[0] === "0") {
			confecaño = 2000 + parseInt(año);
		} else {
			confecaño = 1900 + parseInt(año);
		}
		var edad = parseInt(nowaño) - parseInt(confecaño);
		if (nowmes < mes) edad -= 1;

		return edad;
	};
	Search = (evt) => {
		const { value } = evt.target;
		let pacientes = [];
		let criteriobusqueda = value;

		if (criteriobusqueda !== "") {
			pacientes = this.props.pacientes.filter((p) => p.fechaDeCreacion.includes(value) || p.nombre.includes(value) || p.apellidos.includes(value) || p.ci.includes(value) || p.direccion.includes(value) || (p.historiaclinica != null ? p.historiaclinica.numerohistoria.includes(value) : false));
			this.setState({
				pacientes: pacientes,
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

	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "pacientes");
		//chequear si es paciente y tengo permiso
		let pacientes = this.props.pacientes;
		if (this.state.criteriobusqueda !== "") pacientes = this.state.pacientes;
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					<Label attached="top left" className="div-label-attached" size="large">
						<Icon name="wheelchair" size="large" inverted /> Gestión de Pacientes
					</Label>
					<Input name="buscar" value={this.state.criteriobusqueda} icon={<Icon name="search" inverted circular link onClick={this.Search} />} placeholder="Buscar..." onChange={this.Search} onKeyDown={this.OnPressEnter} />
					{pacientes.length > 0 ? (
						<Table compact celled definition attached="top" className="div-table">
							<Table.Header className="div-table-header-row">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell colSpan="15">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Edad</Table.HeaderCell>
									<Table.HeaderCell>Nombres y Apellidos</Table.HeaderCell>
									<Table.HeaderCell>Carnet Identidad</Table.HeaderCell>
									{/* <Table.HeaderCell>Dirección</Table.HeaderCell> */}
									{/* <Table.HeaderCell>Teléfonos</Table.HeaderCell> */}
									<Table.HeaderCell>Madre</Table.HeaderCell>
									{/* <Table.HeaderCell className="cells-max-witdh-2">Género</Table.HeaderCell> */}
									<Table.HeaderCell className="cells-max-witdh-2">Hijos</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Historia Clínica</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Transfusiones</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Embarazos</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Examenes</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{pacientes.map((paciente) => {
									let negative = !paciente.activo;
									let madre = paciente.madre;
									let madrenombreyapellido = madre == null ? "Indefinido" : madre.nombre + " " + madre.apellidos;
									return (
										<Table.Row key={paciente._id} negative={negative}>
											<Table.Cell collapsing>
												<Icon name="wheelchair" />
											</Table.Cell>
											<Table.Cell>
												<Label size="large" circular>
													{this.CalcAge(paciente)}
												</Label>
											</Table.Cell>
											<Table.Cell>
												{paciente.nombre} {paciente.apellidos}
											</Table.Cell>
											<Table.Cell>{paciente.ci}</Table.Cell>
											{/* <Table.Cell>{paciente.direccion}</Table.Cell> */}
											{/* <Table.Cell>{paciente.telefono}</Table.Cell> */}
											<Table.Cell>
												<Button icon labelPosition="right" className="button-childs">
													<Icon name="venus" className="button-icon-childs" />
													{madrenombreyapellido}
												</Button>
											</Table.Cell>
											{/* <Table.Cell textAlign="center">{paciente.sexo === "M" ? <Icon name="man" className="button-icon-childs" /> : <Icon name="woman" className="button-icon-childs" />}</Table.Cell> */}
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.modificar ? (
													<ComponentChilds Deslogin={this.props.Deslogin} global={this.props.global} paciente={paciente} pacientes={this.props.pacientes} GetDataFromServer={this.props.GetDataFromServer} />
												) : (
													<Button icon labelPosition="right" className="modal-button-other">
														<Icon name="child" className="modal-icon-other" />
														{paciente.hijos !== null ? (paciente.hijos.length > 0 ? paciente.hijos.length : 0) : ""}
													</Button>
												)}
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentSeeClinicHistory Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} global={this.props.global} paciente={paciente} pacientes={this.props.pacientes} historiasclinicas={this.props.historiasclinicas} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentModalTran Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.props.pacientes} paciente={paciente} transfusiones={paciente.transfusiones} GetDataFromServer={this.props.GetDataFromServer} cambiarIcono={true} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentModalPregnancy Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.props.pacientes} paciente={paciente} embarazos={paciente.embarazos} GetDataFromServer={this.props.GetDataFromServer} cambiarIcono={true} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<ComponentModalTest Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.props.pacientes} embarazos={paciente.embarazos} examenes={paciente.examenes} paciente={paciente} GetDataFromServer={this.props.GetDataFromServer} cambiarIcono={true} />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="activo" labelPosition="left" label={paciente.activo ? "Si" : "No"} checked={paciente.activo} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.DeletePatient(paciente)} /> : <Button icon="remove circle" className="button-remove" disabled />}
												{accesomenu.permisos.modificar ? <ComponentUpdatePatient Deslogin={this.props.Deslogin} GetDataFromServer={this.props.GetDataFromServer} paciente={paciente} global={this.props.global} pacientes={this.props.pacientes} /> : <Button icon="edit" disabled />}
												<ComponentSeePatient Deslogin={this.props.Deslogin} paciente={paciente} global={this.props.global} roles={this.props.roles} pacientes={this.props.pacientes} detail={true} />
											</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>
						</Table>
					) : (
						this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)
					)}
				</Grid.Column>
			</Grid>
		);
	}
}
//#endregion

//#region Exports
export default ComponentPatients;
//#endregion
