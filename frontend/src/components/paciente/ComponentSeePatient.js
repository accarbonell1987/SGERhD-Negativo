//#region Importaciones
import React, { Component } from "react";
import { Button, Icon, Header, Modal, Form } from "semantic-ui-react";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Definicion de Clase
class ComponentSeePatient extends Component {
	state = {
		openModal: false,
		opcionPacientes: [],
	};

	generos = [
		{ key: "M", text: "Masculino", value: "M", icon: "man" },
		{ key: "F", text: "Femenino", value: "F", icon: "woman" },
	];

	//constructor
	constructor(props) {
		super(props);

		this.ClearModalState = this.ClearModalState.bind(this);
		this.ChangeModalInput = this.ChangeModalInput.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.HandleSubmit = this.HandleSubmit.bind(this);
	}
	componentDidMount() {
		this.ClearModalState();
	}

	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	//validar el formulario
	HandleSubmit = (evt) => {
		evt.preventDefault();
		return false;
	};
	//Actualiza los inputs con los valores que vamos escribiendo
	ChangeModalInput = (evt) => {
		const { name, value } = evt.target;

		this.setState({
			[name]: value,
		});
	};
	//cambiar el estado en el MODAL para adicionar paciente
	ChangeModalState = async (evt) => {
		if (evt.target.className.includes("button-childs") || evt.target.className.includes("button-icon-childs")) {
			this.setState({
				openModal: true,
			});
		} else if (evt.target.className.includes("modal-button-cancel")) {
			this.ClearModalState();
		} else {
			this.ClearModalState();
		}
	};
	//limpiar states
	ClearModalState = () => {
		let opcion = [];
		this.props.pacientes.forEach((p) => {
			let nombreyapellidos = p.nombre + " " + p.apellidos;
			let cur = {
				key: p._id,
				text: nombreyapellidos,
				value: p._id,
				icon: "wheelchair",
			};
			opcion = [...opcion, cur];
		});
		this.setState({
			openModal: false,
			opcionPacientes: opcion,
		});
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

	render() {
		const paciente = this.props.paciente;
		return (
			<Modal
				open={this.state.openModal}
				trigger={
					<Button icon labelPosition="right" className="button-childs" onClick={this.ChangeModalState}>
						<Icon name="wheelchair" className="button-icon-childs" onClick={this.ChangeModalState} />
						{paciente.nombre + " " + paciente.apellidos}
					</Button>
				}
			>
				<Header icon="wheelchair" content="Detalles Paciente" />
				<Modal.Content>
					<Form ref="form">
						<Form.Input name="edad" icon="clock outline" iconPosition="left" label="Edad:" value={this.CalcAge(paciente)} />
						<Form.Input name="nombre" icon="address card outline" iconPosition="left" label="Nombre:" value={paciente.nombre} placeholder="Facundo" />
						<Form.Input name="apellidos" icon="address card outline" iconPosition="left" label="Apellidos:" value={paciente.apellidos} placeholder="Correcto Inseguro" />
						<Form.Input name="ci" icon="vcard" iconPosition="left" label="Carnet de Identidad:" value={paciente.ci} placeholder="90112050112" />
						<Form.Input name="direccion" icon="building outline" iconPosition="left" label="Dirección:" value={paciente.direccion} placeholder="Calle 6 No.512..." />
						<Form.Input name="direccionopcional" icon="building outline" iconPosition="left" label="Dirección Opcional:" value={paciente.direccionopcional} placeholder="Calle 6 No.512..." />
						<Form.Input name="telefono" icon="phone" iconPosition="left" label="Teléfono:" value={paciente.telefono} placeholder="52802640" />
						<Form.Select name="sexo" label="Género:" placeholder="Seleccionar Género" options={this.generos} value={paciente.sexo} fluid selection />
						<Form.Select name="conyuge" label="Cónyuge:" placeholder="Seleccionar Cónyuge" options={this.state.opcionPacientes} value={paciente.conyuge} fluid selection />
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type>
						<Icon name="remove" /> Cancelar
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}
//#endregion

//#region Exports
export default ComponentSeePatient;
//#endregion
