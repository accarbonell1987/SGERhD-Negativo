import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import ComponentApp from "../components/ComponentApp";
import ComponentPageNotFound from "../components/ComponentNotFound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <CookiesProvider>
        <Route exact path="/" component={ComponentApp} />
        <Route component={ComponentPageNotFound} />
      </CookiesProvider>
    </Switch>
  </BrowserRouter>
);

export default Router;
