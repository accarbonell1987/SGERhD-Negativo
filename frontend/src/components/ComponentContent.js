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
import ComponentTests from "./examen/ComponentTests";
import ComponentPruebas from "./pruebas/ComponentPruebas";
//#endregion

//#region Defincion de la clase
class ComponentContent extends Component {
	state = {
		pacientes: [],
		usuarios: [],
		historiasclinicas: [],
		transfusiones: [],
		embarazos: [],
		examenes: [],
		pruebas: [],
	};

	constructor(props) {
		super(props);
		this.GetDataFromServer = this.GetDataFromServer.bind(this);
	}

	componentDidMount = () => {
		console.log("Se montó");
		this.GetDataFromServer();
	};
	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}

	GetDataFromServer = () => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			this.AllTrans();
			this.AllClinicsHistory();
			this.AllPatients();
			this.AllUsers();
			this.AllPregnancies();
			this.AllTests();
			this.AllPruebas();
		}
	};

	//obtener todos los historia clinica desde la API
	AllClinicsHistory = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/historiaclinica", {
			method: "GET",
			headers: {
				"access-token": data.token,
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
	AllPatients = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/paciente", {
			method: "GET",
			headers: {
				"access-token": data.token,
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
	//obtener todas las transfusiones desde la API
	AllTrans = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/transfusion", {
			method: "GET",
			headers: {
				"access-token": data.token,
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
	//obtener todos los embarazos desde la API
	AllPregnancies = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/embarazo", {
			method: "GET",
			headers: {
				"access-token": data.token,
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
	AllUsers = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/usuario", {
			method: "GET",
			headers: {
				"access-token": data.token,
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
	//obtener todos los examenes desde la API
	AllTests = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/examen", {
			method: "GET",
			headers: {
				"access-token": data.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ examenes: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};
	AllPruebas = () => {
		const data = this.props.global.cookies();

		fetch(this.props.global.endpoint + "api/prueba", {
			method: "GET",
			headers: {
				"access-token": data.token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					this.setState({ examenes: data.data });
				} else {
					Swal.fire({ position: "center", icon: "error", title: data.message, showConfirmButton: false, timer: 3000 });
				}
			})
			.catch((err) => {
				Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 3000 });
			});
	};

	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === this.props.opcionmenu);
		//chequear si es usuario y tengo permiso
		if (this.props.opcionmenu === "usuarios" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentUsers Deslogin={this.props.Deslogin} global={this.props.global} usuarios={this.state.usuarios} GetDataFromServer={this.GetDataFromServer} />
					<ComponentFooter />
				</div>
			);
			//chequear si es pacientes y tengo permiso
		} else if (this.props.opcionmenu === "pacientes" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentPatients Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.state.pacientes} historiasclinicas={this.state.historiasclinicas} GetDataFromServer={this.GetDataFromServer} />
					<ComponentFooter />
				</div>
			);
			//chequear si es pacientes y tengo permiso
		} else if (this.props.opcionmenu === "historiaclinica" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentClinicHistory Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.state.pacientes} historiasclinicas={this.state.historiasclinicas} GetDataFromServer={this.GetDataFromServer} />
					<ComponentFooter />
				</div>
			);
		} else if (this.props.opcionmenu === "transfusiones" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentTrans Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.state.pacientes} transfusiones={this.state.transfusiones} GetDataFromServer={this.GetDataFromServer} />
					<ComponentFooter />
				</div>
			);
		} else if (this.props.opcionmenu === "embarazos" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentPregnancies Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.state.pacientes} embarazos={this.state.embarazos} GetDataFromServer={this.GetDataFromServer} />
					<ComponentFooter />
				</div>
			);
		} else if (this.props.opcionmenu === "examenes" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentTests Deslogin={this.props.Deslogin} global={this.props.global} pacientes={this.state.pacientes} embarazos={this.state.embarazos} examenes={this.state.examenes} pruebas={this.state.pruebas} GetDataFromServer={this.GetDataFromServer} />
					<ComponentFooter />
				</div>
			);
		} else if (this.props.opcionmenu === "pruebas" && accesomenu.permisos.menu) {
			return (
				<div className="Content">
					<ComponentPruebas Deslogin={this.props.Deslogin} global={this.props.global} examenes={this.state.examenes} pruebas={this.state.pruebas} GetDataFromServer={this.GetDataFromServer} />
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
