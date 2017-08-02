const nodeExternals = require('webpack-node-externals'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    envVars = process.env || {},
    environment = envVars.ENVIRONMENT || 'prod',
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
                            'transform-class-properties'
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            minimize: true,
                            module: true,
                            importLoaders: 1,
                            localIdentName: (environment === 'local') ? '[name]__[local]--[hash:8]' : '[hash:8]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    }
                ]})
            }

            // loaders for other file types can go here
        ]
    },

    externals: [
        nodeExternals(),

        function (context, request, callback) {
            if (/webpack\.config|bundles\.json/.test(request)) {
                return callback(null, 'commonjs ' + request);
            }
            callback();
        }
    ],

    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^\.\.\/\.\.\/\.\.\/client\/routes\.js$/,
            '../../../server/routes.js'
        ),

        new ExtractTextPlugin({
            ignoreOrder: true,
            filename: 'css/[name].css'
        })
    ],

    devtool: 'source-map'
};