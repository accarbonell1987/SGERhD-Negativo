//#region Importaciones
import React, { Component } from "react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "./global/css/Content.css";
//#endregion

//#region Componentes
import ComponentUsers from "./usuario/ComponentUsers";
import ComponentPatients from "./paciente/ComponentPatients";
import ComponentClinicHistory from "./historiaclinica/ComponentClinicHistory";
import ComponentTrans from "./transfusiones/ComponentTrans";
import ComponentFooter from "./ComponentFooter";
import ComponentPregnancies from "./embarazo/ComponentPregnancies";
//#endregion

//#region Defincion de la clase
class ComponentContent extends Component {
	state = {
		pacientes: [],
		usuarios: [],
		historiasclinicas: [],
		transfusiones: [],
		embarazos: [],
	};

	constructor(props) {
		super(props);
		this.reloadFromServer = this.reloadFromServer.bind(this);
	}

	componentDidMount = () => {
		this.reloadFromServer();
	};

	reloadFromServer = () => {
		this.allTrans();
		this.allClinicsHistory();
		this.allPatients();
		this.allUsers();
		this.allPregnancies();
	};

	//obtener todos los historia clinica desde la API
	allClinicsHistory = async () => {
		await fetch(this.props.parentState.endpoint + "api/historiaclinica", {
			method: "GET",
			headers: {
				"access-token": this.props.parentState.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ historiasclinicas: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};
	//obtener todos los pacientes desde la API
	allPatients = async () => {
		await fetch(this.props.parentState.endpoint + "api/paciente", {
			method: "GET",
			headers: {
				"access-token": this.props.parentState.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ pacientes: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};
	allTrans = async () => {
		await fetch(this.props.parentState.endpoint + "api/transfusion", {
			method: "GET",
			headers: {
				"access-token": this.props.parentState.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ transfusiones: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};
	allPregnancies = async () => {
		await fetch(this.props.parentState.endpoint + "api/embarazo", {
			method: "GET",
			headers: {
				"access-token": this.props.parentState.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ embarazos: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};
	//obtener todos los usuarios desde la API
	allUsers = async () => {
		await fetch(this.props.parentState.endpoint + "api/usuario", {
			method: "GET",
			headers: {
				"access-token": this.props.parentState.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ usuarios: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};

	render() {
		//buscar el permiso del rol
		const permiso = this.props.permisos.find((p) => p.rol === this.props.parentState.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === this.props.opcionmenu);
		//chequear si es usuario y tengo permiso
		if (this.props.opcionmenu === "usuarios" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentUsers parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} usuarios={this.state.usuarios} reloadFromServer={this.reloadFromServer} />
					<ComponentFooter />
				</div>
			);
			//chequear si es pacientes y tengo permiso
		} else if (this.props.opcionmenu === "pacientes" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentPatients parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} pacientes={this.state.pacientes} historiasclinicas={this.state.historiasclinicas} reloadFromServer={this.reloadFromServer} />
					<ComponentFooter />
				</div>
			);
			//chequear si es pacientes y tengo permiso
		} else if (this.props.opcionmenu === "historiaclinica" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentClinicHistory parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} pacientes={this.state.pacientes} historiasclinicas={this.state.historiasclinicas} reloadFromServer={this.reloadFromServer} />
					<ComponentFooter />
				</div>
			);
		} else if (this.props.opcionmenu === "transfusiones" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentTrans parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} pacientes={this.state.pacientes} transfusiones={this.state.transfusiones} reloadFromServer={this.reloadFromServer} />
					<ComponentFooter />
				</div>
			);
		} else if (this.props.opcionmenu === "embarazos" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentPregnancies parentState={this.props.parentState} roles={this.props.roles} permisos={this.props.permisos} pacientes={this.state.pacientes} embarazos={this.state.embarazos} reloadFromServer={this.reloadFromServer} />
					<ComponentFooter />
				</div>
			);
		} else {
			return (
				<div>
					<h2>OTRA {this.props.opcionmenu}</h2>
					<ComponentFooter />
				</div>
			);
		}
	}
}
//#endregion

//#region Exports
export default ComponentContent;
//#endregion
