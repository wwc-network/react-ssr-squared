import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class About extends Component {
    static fetchData() {
        return new Promise(resolve => resolve());
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About</title>
                </Helmet>
                <strong>About</strong>
            </div>
        );
    }
}

export default About;