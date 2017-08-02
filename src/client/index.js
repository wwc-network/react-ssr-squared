import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../shared/redux/store';
import App from '../shared/modules/app-shell/index.jsx';

import * as Components from './route-components.js';

const splitPoints = window.splitPoints || [];

Promise.all(splitPoints.map(function preloadComponent(chunk) {
    if (typeof Components[chunk].loadComponent === 'function') {
        return Components[chunk].loadComponent();
    } else {
        return new Promise(resolve => resolve());
    }
})).then(() => {
    render((
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    ), document.getElementById('root'));
});

if (module.hot) {
    module.hot.accept();
}