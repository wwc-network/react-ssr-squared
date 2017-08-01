const nodeExternals = require('webpack-node-externals'),
    path = require('path'),
    webpack = require('webpack'),
    srcPath = path.resolve(__dirname),
    distPath = path.resolve(__dirname, './dist/server/');

module.exports = {
    context: srcPath,
    
    entry: './src/server/index.js',

    output: {
        path: distPath,
        filename: 'server.js'
    },

    target: 'node',

    node: {
        __dirname: false,
        __filename: false
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                exclude: /node_modules|\.min\.js/,
                loader: 'eslint-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'react'
                        ],
                        plugins: [
                            'transform-object-rest-spread',
                            'syntax-dynamic-import',
                            'transform-class-properties',
                        ]
                    }
                }],
            }

            // loaders for other file types can go here
        ]
    },

    externals: [
        nodeExternals(),

        function(context, request, callback) {
            if (/webpack\.config|bundles\.json/.test(request)){
                return callback(null, 'commonjs ' + request);
            }
            callback();
        }
    ],

    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^\.\.\/\.\.\/\.\.\/client\/routes\.js$/,
            '../../../server/routes.js'
        )
    ],

    devtool: 'source-map'
};