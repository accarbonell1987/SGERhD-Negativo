import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ComponentApp from "../components/ComponentApp";
import ComponentPageNotFound from "../components/ComponentNotFound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ComponentApp} />
      <Route component={ComponentPageNotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
