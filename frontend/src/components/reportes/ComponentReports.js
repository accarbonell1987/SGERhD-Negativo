//Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Image, Checkbox, Input } from "semantic-ui-react";
import Swal from "sweetalert2";

//CSS
import "../global/css/Gestionar.css";

//Componentes

//Defincion de la clase
class ComponentUsers extends Component {
	constructor(props) {
		super(props);

		this.Search = this.Search.bind(this);
		this.OnPressEnter = this.OnPressEnter.bind(this);
		this.ShowReport = this.ShowReport.bind(this);
	}
	state = { reportes: null, criteriobusqueda: "" };

	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	Search = (evt) => {
		const { value } = evt.target;
		let reportes = [];
		let criteriobusqueda = value;

		if (criteriobusqueda !== "") {
			reportes = this.props.reportes.filter((p) => p.nombre.includes(value) || p.descripcion.includes(value));
			this.setState({
				reportes: reportes,
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
	ShowReport = (id) => {};

	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "reportes");

		let reportes = this.props.reportes;
		if (this.state.criteriobusqueda !== "") reportes = this.state.reportes;
		//chequear si es reporte y tengo permiso
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					<Label attached="top left" className="div-label-attached" size="large">
						<Icon name="users" size="large" inverted /> Reportes
					</Label>
					<Input name="buscar" value={this.state.criteriobusqueda} icon={<Icon name="search" inverted circular link onClick={this.Search} />} placeholder="Buscar..." onChange={this.Search} onKeyDown={this.OnPressEnter} />
					<Table compact celled definition attached="top" className="div-table">
						<Table.Header>
							{reportes.length > 0 ? (
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Nombre</Table.HeaderCell>
									<Table.HeaderCell>Descripción</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							) : (
								""
							)}
						</Table.Header>
						<Table.Body>
							{reportes.map((reporte) => {
								return (
									<Table.Row key={reporte.key}>
										<Table.Cell collapsing>
											<Icon name="file" />
										</Table.Cell>
										<Table.Cell>{reporte.nombre}</Table.Cell>
										<Table.Cell>{reporte.descripcion}</Table.Cell>
										<Table.Cell className="cell-acciones" collapsing>
											{
												//acceso a eliminar
												accesomenu.permisos.leer ? (
													<Button className="modal-button-action" onClick={() => this.ShowReport(reporte)}>
														<Icon className="modal-icon" name="eye" />
													</Button>
												) : (
													<Button icon="reportes" disabled />
												)
											}
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
}

export default ComponentUsers;
