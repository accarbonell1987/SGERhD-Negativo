//Importaciones
import React, { Component } from "react";
import { Label } from "semantic-ui-react";

//CSS
import "./global/css/Footer.css";

//Defincion de la clase
class ComponentFooter extends Component {
	render() {
		return (
			<div className="footer">
				<div className="footercopyright">
					<p>
						&copy; 2020 - Sistema de Gestion de Embarazadas{" "}
						<Label size="medium" color="green">
							RhD-Negativo
						</Label>
					</p>
				</div>
				{/* <div className="footersocial">
					<Button circular icon="facebook" inverted size="small" />
					<Button circular icon="twitter" inverted size="small" />
					<Button circular icon="linkedin" inverted size="small" />
					<Button circular icon="google plus" inverted size="small" />
				</div> */}
			</div>
		);
	}
}

export default ComponentFooter;
