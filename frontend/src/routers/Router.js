import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ComponentDashboard from '../components/PageDashboard';
import ComponentPageNotFound from '../components/PageNotFound';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path = '/' component = { ComponentDashboard } />
            <Route component = { ComponentPageNotFound }/>
        </Switch>
    </BrowserRouter>
)

export default Router;