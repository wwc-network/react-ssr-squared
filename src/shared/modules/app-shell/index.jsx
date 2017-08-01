import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header/index.jsx';
import routeOptions from '../../../client/routes.js';

const App = function () {
    let routes = routeOptions.routes.map(({ path, component, exact }, _i) =>
        <Route key={Math.random() + 'ROUTE_'} exact={exact} path={path} component={component} />
    );
    
    return (
        <div>
            <Header />
            <Switch>
                {routes}
            </Switch>
        </div>
    );
}

export default App;