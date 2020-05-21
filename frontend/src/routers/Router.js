import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ComponentDashboard from '../components/ComponentDashboard';
import ComponentPageNotFound from '../components/ComponentNotFound';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path = '/' component = { ComponentDashboard } />
            <Route component = { ComponentPageNotFound }/>
        </Switch>
    </BrowserRouter>
)

export default Router;