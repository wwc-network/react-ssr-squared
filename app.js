if (process.env.DEV_MODE === 'webpack') {
    // get all the goodness of webpack development, ie. hot module reloading
    // but no server side rendering
    require('./server.develop.js');
} else {
    // enable server side rendering
    // no hot module reloading... yet
    require('./dist/server/server.js');
}