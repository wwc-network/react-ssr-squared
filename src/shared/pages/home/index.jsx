import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class Home extends Component {
    static fetchData() {
        return new Promise(resolve => resolve());
    }

    componentDidMount() {
        console.log('home mounted');
    }

    render() {
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Home</title>
                </Helmet>
                <strong>Welcome</strong>
            </div>
        );
    }
}

export default Home;