import React from 'react';

export function syncComponent(mod, chunkName) {
    const Component = mod.default ? mod.default : mod; // es6 module compat

    function wrapComponent(props) {
        if (props.staticContext && props.staticContext.splitPoints) {
            props.staticContext.splitPoints.push(chunkName);
        }

        return (<Component {...props} />);
    }

    syncComponent.propTypes = {
        staticContext: React.PropTypes.object
    };

    return wrapComponent;
}
