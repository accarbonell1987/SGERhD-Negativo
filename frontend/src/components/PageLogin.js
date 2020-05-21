//Importaciones
import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image } from 'semantic-ui-react'

//CSS
import './global/css/Login.css';

//Definicion de la Clase
class PageLogin extends Component {
  constructor (props) {
    super(props);

    this.state = {
    }

    this.handleAutenticarClick = this.handleAutenticarClick.bind(this);
  }

  handleAutenticarClick = () => {
    this.props.modifyLoginState();
  }

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
                        icon='user'
                        iconPosition='left'
                        label='Usuario'
                        placeholder='Usuario'
                    />
                    <Form.Input
                        icon='lock'
                        iconPosition='left'
                        label='Contraseña'
                        type='Contraseña'
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

export default PageLogin