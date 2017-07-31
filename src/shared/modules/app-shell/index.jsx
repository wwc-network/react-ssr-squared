import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import RedirectWithStatus from './redirect-w-status.jsx';
import Header from '../header/index.jsx';
import routeOptions from '../../../client/routes.js';

const App = function () {
    let routes = routeOptions.routes.map(({ path, component, exact }, _i) =>
        <Route key={Math.random() + 'ROUTE_'} exact={exact} path={path} component={component} />
    );
    
    /*
    let redirects = routeOptions.redirects.map(({ from, to, status }, i) =>
        <RedirectWithStatus key={Math.random() + 'REDIRECT_'} from={from} to={to} status={status} />
    );
    */

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