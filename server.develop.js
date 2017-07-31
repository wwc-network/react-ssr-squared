const express = require('express'),
    app = express(),
    port = process.env.PORT || 9000,
    webpackConfig = require('./webpack.config.js'),
    serverHtml = require('./src/server/utils/html.js'),
    compiler = require('webpack')(webpackConfig),
    compression = require('compression'),
    webpackDevHandler = require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true
    }),
    webpackHotHandler = require('webpack-hot-middleware')(compiler, {});

app.use(compression());

app.use(webpackDevHandler);

app.use(webpackHotHandler);

app.use('/assets/fonts', express.static('./dist/assets/fonts'));

app.use((req, res) => {
  
    const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
   
    // TODO: create webpack lib file and function to filter assets
    res.send(serverHtml.renderHtml('', '', {
        /*
        vendor_css: {
            css: webpackConfig.output.publicPath + assetsByChunkName.vendor_css.filter(function (path) { return path.endsWith('.css'); })[0]
        },
        head_css: {
            css: webpackConfig.output.publicPath + assetsByChunkName.head_css.filter(function (path) { return path.endsWith('.css'); })[0]
        },
        */
        vendor_js: {
            js: webpackConfig.output.publicPath + assetsByChunkName.vendor_js.filter(function (path) { return path.endsWith('.js'); })[0]
        },
        app: {
            js: webpackConfig.output.publicPath + assetsByChunkName.app.filter(function (path) { return path.endsWith('.js'); })[0]
        }
    },
    {
        title: '',
        meta: '',
        link: ''
    }));
});

app.listen(port, function () {
    console.log('app running on localhost:' + port);
});
