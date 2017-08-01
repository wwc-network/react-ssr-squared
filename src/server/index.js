import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import helmet from 'react-helmet';
import App from '../shared/modules/app-shell/index.jsx';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../shared/redux/reducers/combine';
import { StaticRouter as Router, matchPath } from 'react-router';
import thunk from '../shared/redux/middleware/thunk';
import routeBank from './routes.js';

const dist = require('../assets/json/bundles.json'),
    serverHtml = require('./utils/html.js'),
    compression = require('compression');

const app = express();

app.use(compression());

app.use('/assets', express.static('./dist/assets'));

app.get('*', (req, res) => {
    // TODO: Investigate whether we need to read routes config and if it doesn't exist just disable SSR on the fly
    const store = createStore(reducers, {}, applyMiddleware(thunk));
    
    let foundPath = null;

    let { component } = routeBank.routes.find(
        ({ path, exact }) => {
            foundPath = matchPath(req.url,
                {
                    path,
                    exact,
                    strict: false
                }
            )
            return foundPath;
        }) || {}

    if (!component) {
        component = {};
    }
    
    if (!component.fetchData) {
        component.fetchData = () => new Promise((resolve) => resolve());
    }

    component.fetchData({ store, params: (foundPath ? foundPath.params : {}) }).then(() => {
        let preloadedState = store.getState();

        // TODO: Can we take this with redux/store instead
        let context = {
            splitPoints: []
        };

        const html = ReactDOM.renderToString(
            <Provider store={store}>
                <Router context={context} location={req.url}>
                    <App />
                </Router>
            </Provider>
        );

        console.log(context);

        const helmetData = helmet.renderStatic();

        if (context.url) {
            res.redirect(context.status, 'http://' + req.headers.host + context.url);
        } else if (foundPath && foundPath.path === '/404') {
            res.status(404).send(serverHtml.renderHtml(html, preloadedState, dist, helmetData, context));
        } else {
            res.send(serverHtml.renderHtml(html, preloadedState, dist, helmetData, context));
        }
    });
});

const port = process.env.PORT || 9000;

app.listen(port, function () {
    console.log('app running on localhost:' + port);
});