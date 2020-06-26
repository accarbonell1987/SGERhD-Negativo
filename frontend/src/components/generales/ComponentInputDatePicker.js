//#region Importaciones
import React, { Component } from "react";
import { Button, Modal, Icon, Input } from "semantic-ui-react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import moment from "moment";
import { es } from "moment/locale/es";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Constantes
const definitions = {
	available: { color: null, label: "Disponible" },
	enquire: { color: "#ffd200", label: "Preguntar" },
	unavailable: { color: "#78818b", label: "No Disponible" },
};
const ranges = [
	// {
	//   state: "enquire",
	//   range: moment.range(moment().add(2, "weeks").subtract(5, "days"), moment().add(2, "weeks").subtract(6, "days")),
	// },
	{
		state: "unavailable",
		range: moment.range(moment().subtract(0, "days"), moment().add(100, "years")),
	},
];
//#endregion

//#region Definision de Clase
class ComponentInputDatePicker extends Component {
	state = {
		openModal: false,
		fecha: null,
		estados: null,
		idioma: null,
		modoboton: false,
		fechaMinima: null,
	};

	constructor(props) {
		super(props);

		this.HandleSelect = this.HandleSelect.bind(this);
		this.ChangeModalState = this.ChangeModalState.bind(this);
		this.ClearModalState = this.ClearModalState.bind(this);
	}

	componentDidMount() {
		this.ClearModalState();
	}

	HandleSelect = (value, states) => {
		const today = moment().subtract(1, "days");
		if (this.props.restringir) {
			if (today.isAfter(value)) {
				this.setState({
					fecha: value,
					estados: states,
					modoboton: true,
				});
			}
		} else {
			this.setState({
				fecha: value,
				estados: states,
				modoboton: true,
			});
		}
	};
	ChangeModalState = async (evt) => {
		if (evt.target.className.includes("modal-icon-fire") || evt.target.className.includes("modal-input-100p")) {
			this.ClearModalState();
			this.setState({ openModal: true });
		} else {
			this.setState({ openModal: false });
			this.props.SetDate(this.state.fecha);
		}
	};
	ClearModalState = () => {
		const idioma = moment.locale(es);
		//actualizar los states
		this.setState({
			openModal: false,
			fecha: this.props.fecha || moment().subtract(1, "days"),
			estados: null,
			idioma: idioma,
			fechaMinima: null,
		});
	};

	render() {
		const rangos = this.props.restringir ? ranges : [];
		return (
			<Modal
				className="modal-datepicker"
				open={this.state.openModal}
				trigger={
					<Input
						className="modal-input-100p"
						icon={<Icon name="calendar alternate" className="modal-icon-fire" circular onClick={this.ChangeModalState} />}
						placeholder="Fecha..."
						onClick={(evt) => {
							this.setState({ openModal: true });
						}}
						// value={this.state.fecha ? this.state.fecha.format("DD-MM-YYYY") : ""}
						value={moment(this.state.fecha).format("DD-MM-YYYY")}
					/>
				}
			>
				<Modal.Header icon="calendar alternate">Escoger Fecha</Modal.Header>
				<Modal.Content>
					<DateRangePicker firstOfWeek={1} numberOfCalendars={1} selectionType="single" stateDefinitions={definitions} dateStates={rangos} singleDateRange={true} defaultState="available" showLegend={false} locale={this.state.idioma} value={moment(this.state.fecha)} onSelect={this.HandleSelect} />
				</Modal.Content>
				<Modal.Actions className="modal-action-centered">
					{this.state.modoboton ? (
						<Button color="green" onClick={this.ChangeModalState} className="modal-button-accept" type position>
							<Icon name="checkmark" className="modal-icon-accept" />
							Aceptar
						</Button>
					) : (
						<Button color="red" onClick={this.ChangeModalState} className="modal-button-cancel" type position>
							<Icon name="remove" className="modal-icon-cancel" />
							Cerrar
						</Button>
					)}
				</Modal.Actions>
			</Modal>
		);
	}
}
//#endregion

//#region Exports
export default ComponentInputDatePicker;
//#endregion
