import React from 'react';
import dynamic from 'dva/dynamic';
import { Router, Route, Switch } from 'dva/router';

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    models: () => [
      import('./models/HomeModel'),
      import('./models/PosModel'),
      import('./models/ShiftModel'),
      import('./models/ManagerModel'),
      import('./models/ChargeModel'),
      import('./models/VenditionModel'),
    ],
    component: () => import('./routes/IndexPage'),
  });

  const LoginPage = dynamic({
    app,
    models: () => [
      import('./models/LoginModel')
    ],
    component: () => import('./routes/LoginPage'),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/shopping" component={IndexPage} />
        <Route exact path="/shift" component={IndexPage} />
        <Route exact path="/manager" component={IndexPage} />
        <Route exact path="/charge" component={IndexPage} />
        <Route exact path="/vendition" component={IndexPage} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;