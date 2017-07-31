import React from 'react';

function asyncRoute(getComponent) {
    return class AsyncComponent extends React.Component {
        static Component = null;
        mounted = false;

        state = {
            Component: AsyncComponent.Component
        };

        componentWillMount() {
            if (this.state.Component === null) {
                getComponent().then(m => m.default).then(Component => {
                    AsyncComponent.Component = Component;
                    
                    if (this.mounted) {
                        this.setState({Component});
                    }
                });
            }
        }

        componentDidMount() {
            this.mounted = true;
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        render() {
            const {Component} = this.state;

            if (Component !== null) {
                return <Component {...this.props} />
            }

            return null; // or <div /> with a loading spinner, etc..
        }
    }
}

import Home from '../shared/pages/home/index.jsx';

const About = asyncRoute(() => System.import('./pages/about/index.jsx'));

export default {
    routes: [
        {
            path: '/',
            component: Home,
            exact: true
        },
        {
            path: '/about',
            component: About,
            exact: true
        }        
    ]
};