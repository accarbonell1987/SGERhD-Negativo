//#region Importaciones
import React, { Component } from "react";
import { Header, Image, Dropdown } from "semantic-ui-react";
import Swal from "sweetalert2";
//#endregion

//#region CSS
import "./global/css/Header.css";
//#endregion

//#region Componentes
import ComponentChangePassword from "./usuario/ComponentChangePassword";
//#endregion

//#region Definicion de la Clase
class ComponentHeader extends Component {
	state = { openModalPassword: false, usuario: null, seleccion: -1 };
	options = [
		{ key: 1, text: "Cambiar Contraseña", icon: "key", value: "1" },
		{ key: 2, text: "Salir", icon: "arrow alternate circle left outline", value: "2" },
	];
	trigger = (
		<span>
			<Image avatar src={this.props.userdata.imagen} /> {this.props.userdata.nombrerol}
		</span>
	);

	constructor(props) {
		super(props);

		this.HandleAutenticarClick = this.HandleAutenticarClick.bind(this);
		this.GetUser = this.GetUser.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
	}

	SwalToast = Swal.mixin({
		toast: true,
		position: "top-right",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		onOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});
	HandleAutenticarClick = () => {
		this.SwalToast.fire({
			icon: "success",
			title: "Sessión Cerrada",
		});
		this.props.Deslogin();
	};
	//obetener usuario
	GetUser = async (id) => {
		try {
			const data = this.props.global.cookies();
			const res = await fetch(this.props.global.endpoint + "api/usuario/" + id, {
				method: "GET",
				headers: {
					"access-token": data.token,
				},
			});
			let jsondata = await res.json();
			const { status } = jsondata;
			if (status === 200) {
				return jsondata.data;
			} else {
				return null;
			}
		} catch (err) {
			Swal.fire({ position: "center", icon: "error", title: err, showConfirmButton: false, timer: 5000 });
			return null;
		}
	};
	ChangeModalState = (state) => {
		this.setState({ openModalPassword: state });
	};

	render() {
		const data = this.props.global.cookies();
		console.log(this.state);
		return (
			<Header className="divheader">
				<a href="http://localhost:3000">
					<Image src={require("./global/images/logohletras.png")} className="logo" alt="logo" />
				</a>
				<div className="divbutton">
					<Dropdown
						trigger={this.trigger}
						options={this.options}
						pointing="top left"
						icon={null}
						value={this.state.seleccion}
						onChange={async (e, { value }) => {
							if (value === "1") {
								const usuario = await this.GetUser(data.id);
								this.setState({ openModalPassword: true, usuario: usuario, seleccion: -1 });
							} else {
								this.HandleAutenticarClick();
							}
						}}
					/>
				</div>

				<ComponentChangePassword openModalPassword={this.state.openModalPassword} ChangeModalState={this.ChangeModalState} usuario={this.state.usuario} gestion={false} global={this.props.global} />
			</Header>
		);
	}
}
//#endregion

//#region Exports
export default ComponentHeader;
//#endregion
