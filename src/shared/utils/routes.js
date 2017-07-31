import React from 'react';

export function asyncRoute(getComponent, chunkName) {
    return class AsyncComponent extends React.Component {
        static Component = null;
        mounted = false;

        static loadComponent() { // The function we call before rendering
            return getComponent().then(m => m.default).then(Component => {
                AsyncComponent.Component = Component;
                return Component;
            });
        }
    
        state = {
            Component: AsyncComponent.Component
        };

        componentWillMount() {
            if (this.state.Component === null) {
                AsyncComponent.loadComponent().then(Component => {
                    if (this.mounted) {
                        this.setState({Component});
                    }
                });
            }
        }

        componentDidMount() {
            console.log(chunkName, 'async mounted');

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

export function syncRoute(mod, chunkName) {
    const Component = mod.default ? mod.default : mod; // es6 module compat

    function wrapComponent(props) {
        if (props.staticContext && props.staticContext.splitPoints) {
            props.staticContext.splitPoints.push(chunkName);
        }

        return (<Component {...props} />);
    }

    syncRoute.propTypes = {
        staticContext: React.PropTypes.object
    };

    return wrapComponent;
}
