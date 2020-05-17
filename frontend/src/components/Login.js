import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image } from 'semantic-ui-react'

import './global/css/Login.css';

class Login extends Component {

  // constructor (props) {
  //   super(props);
  // }

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
              <Button content='Ingresar' primary />
            </Grid.Row>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login