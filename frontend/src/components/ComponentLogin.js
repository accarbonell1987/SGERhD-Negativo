//Importaciones
import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image } from 'semantic-ui-react'
import Swal from 'sweetalert2'

//CSS
import './global/css/Login.css';

//Definicion de la Clase
class ComponentLogin extends Component {
  constructor (props) {
    super(props);

    this.state = {
      nombre: '',
      contraseña: ''
    };

    this.handleAutenticarClick = this.handleAutenticarClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleAutenticarClick = (evt) => {
    fetch(this.props.endpoint + 'api/usuario/autenticar', {
      method: 'POST', //metodo
      body: JSON.stringify(this.state), //datos
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      //capturar respuesta
      const { status, message } = data;
      if (status === 'OK') {
        Swal.fire({ position: 'center', icon: 'success', title: message, showConfirmButton: false, timer: 1500 }); //mostrar mensaje
        this.props.modificarLoginState();
      }else{
        Swal.fire({ position: 'center', icon: 'error', title: 'Usuario o contraseña incorrecto', showConfirmButton: false, timer: 3000 }); //mostrar mensaje
        this.setState({ contraseña: '' });
      }
    }).catch(err => {
      Swal.fire({ position: 'center', icon: 'error', title: err, showConfirmButton: false, timer: 3000 }); //mostrar mensaje de error
      this.setState({ contraseña: '' });
    });

    evt.preventDefault();
  };

  handleChange = (evt) => {
    const { name, value} = evt.target;
    this.setState({
      [name] : value
    });
  };

  render() {
    return (
      <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }} className='allgrid'>
        <Grid.Column style={{ maxWidth: 350 }} className='allcolumn'>
          <Grid.Row className='headerrow'>
            <Header>
              <Image src={require('./global/images/logovletras.png')} className='headerimage'/>
            </Header>
          </Grid.Row> 
          <Form>   
            <Grid.Row className='contentrow'>
              <Grid columns={1} relaxed='very' stackable>
                <Grid.Column className='contentrowcolumn'>
                    <Form.Input
                        name = 'nombre'
                        icon = 'user'
                        iconPosition = 'left'
                        label = 'Usuario'
                        placeholder = 'Usuario'
                        onChange = {this.handleChange}
                    />
                    <Form.Input
                        name='contraseña'
                        icon='lock'
                        iconPosition='left'
                        label='contraseña'
                        value={this.state.contraseña}
                        type='password'
                        onChange = {this.handleChange}
                    />
                </Grid.Column>
              </Grid>
            </Grid.Row>
            <Grid.Row className='contentrowbutton'>
              <Button content='Ingresar' icon='check' primary onClick={this.handleAutenticarClick} />
            </Grid.Row>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

export default ComponentLogin