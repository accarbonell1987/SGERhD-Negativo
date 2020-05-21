//Importaciones
import React from 'react';
import { Grid } from 'semantic-ui-react'

//CSS
import './global/css/NotFound.css';

//Defincion de la clase
const PageNotFound = () => (
  <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }} className='allgrid'>
    <Grid.Column style={{ maxWidth: 350 }} className='allcolumn'>
      <Grid.Row className='contentrow'>
        <Grid columns={1} relaxed='very' stackable>
          <Grid.Column className='contentrowcolumn'>
            <h1>404</h1>
            <h3>Pagina No Encontrada</h3>
          </Grid.Column>
        </Grid>
      </Grid.Row>
    </Grid.Column>
  </Grid>
);

export default PageNotFound;