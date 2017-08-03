import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { asyncComponent } from '../../modules/async-component/index.js';

class About extends Component {
    static fetchData() {
        return new Promise(resolve => resolve());
    }

    state = {
        test: asyncComponent(() => fetch('/someexternalcompiledcomponentmodule'), 'Test')
    };

    componentDidMount() {
        // this.state.test.loadComponent();        
    }

    render() {
        const { test } = this.state;

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About</title>
                </Helmet>
                <strong>About</strong>
                <test />
            </div>
        );
    }
}

export default About;