'use strict';

const fs = require('fs'),
    path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    AssetsPlugin = require('assets-webpack-plugin'),
    packageData = require('./package.json'),
    envVars = process.env || {},
    environment = envVars.ENVIRONMENT || 'prod',
    config = require('../../cfg'),
    appConfig = config(environment, 'app'),
    routeConfig = config(environment, 'route'),
    staticDir = path.join(__dirname,  './dist/assets/'),
    componentDir = staticDir + 'bundles/',
    devMode = envVars.DEV_MODE || '',
    nodeEnv = envVars.NODE_ENV || 'production';

let envWebpack,
    cssRuleLoaders = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
                minimize: true,
                module: true,
                importLoaders: 2,
                localIdentName: '[hash:8]'
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                config: {},
                sourceMap: true,
                plugins: () => [
                    require('postcss-import')({}),
                    require('postcss-cssnext')({
                        browsers: ['last 2 versions', '> 5%'],
                    })
                ]
            }
        }
    ],
    webpackConfig = {
        entry: {
            vendor_js: [
                'react',
                'react-dom',
                'firebase/app',
                'firebase/auth'
            ],
            /*
            vendor_css: [
                './src/bundles/vendor/css.js'
            ],
            head_css: [
                './src/bundles/head/css.js'
            ],
            */
            app: [
                './src/client/index.js'
            ]
        },

        output: {
            filename: (environment === 'local') ? '[name].js' : '[name].[chunkhash:20].js',
            path: componentDir,
            // publicPath: '//' + appConfig.content.cdn.assets + appConfig.bundles.staticDir
            publicPath: '/assets/bundles/'
        },

        /**
         * @todo replace config.js with build variables
        */
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules|\.min\.js/,
                    loader: 'eslint-loader'
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules|\.min\.js/,
                    use: (devMode === 'webpack') ? cssRuleLoaders : ExtractTextPlugin.extract({fallback: 'style-loader', use: cssRuleLoaders})
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules|\.min\.js/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'es2015', 'react'
                            ],
                            plugins: [
                                'transform-object-rest-spread',
                                'syntax-dynamic-import',
                                'transform-class-properties',
                                'async-to-promises'
                            ]
                        }
                    }]
                }
            ]
        },

        plugins: [
            new webpack.ProvidePlugin({
                React: 'react',
                ReactDOM: 'react-dom',
                firebase: 'firebase/app',
                'firebase.auth': 'firebase/auth'
            }),

            new webpack.DefinePlugin({
                'process.env': {
                    BROWSER: JSON.stringify(true),
                    NODE_ENV: JSON.stringify(nodeEnv)
                },
                __APP_CONFIG__: JSON.stringify(appConfig)
            }),

            /**
             * @todo Investigate whether we need to create function to calculate hash of vendor entries that match npm modules found in package.json
             * dependencies using the version numbers and concatenated string formed from al the entry names in vendor_js
             * Or write a replacement function that removes chunk definitions from vendor file correctly for LONG TERM CACHING
             * 
             * Replace after plugin compilation done event since manifest hash would be affected here as well.
            */
            new webpack.optimize.CommonsChunkPlugin({
                names: (devMode === 'webpack') ? ['vendor_js'] : ['vendor_js', 'manifest'],
                filename: (environment === 'local') ? '[name].js' : '[name].[hash:20].js',
                minChunks: Infinity
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'app',
                filename: (environment === 'local') ? '[name].js' : '[name].[chunkhash:20].js',
                minChunks: 3,
                children: true
            }),

            new webpack.optimize.AggressiveMergingPlugin(),

            /**
             * @todo Should we manually combine the bundle map with the app bundle using gulp after build
             * to eliminate one request?
             *
             * Use app filename hash value within service worker until we figure out how to pass build hashes
            */
            new AssetsPlugin({
                path: staticDir + 'json/', 
                filename: 'bundles.json',
                metadata: {
                    version: packageData.version,
                    staticDir: appConfig.bundles.staticDir,
                    cacheToServiceWorker: appConfig.serviceworker.bundlesToCache
                }
            })
        ],

        devtool: 'source-map'
    };

// add in dev mode specific configuration
if (devMode === 'webpack') {
    webpackConfig.entry.app.push('react-hot-loader/patch');
    webpackConfig.entry.app.push('webpack-hot-middleware/client');

    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
} else {
    webpackConfig.plugins.push(
        new ExtractTextPlugin((environment === 'local') ? '[name].css' : '[name].[chunkhash:20].css')
    );
}

// add in node env specific configuration
if (nodeEnv === 'production') {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false
            },
            mangle: true,
            output: {
                comments: false
            }
        })
    );
}

/**
* This can be used to store environment settings in different files
*
* @todo move this function to lib/build.js
function mergeObject(obj, source) {
    let prop;

    for (prop in source) {
        if (typeof obj[prop] === 'undefined') {
            obj[prop] = source[prop];
        } else if (typeof obj[prop] === 'object' && !Array.isArray(obj[prop]) && !Array.isArray(source[prop])) {
            obj[prop] = mergeObject(obj[prop], source[prop]);
        }
    }

    return obj;
}

envWebpack = (nodeEnv === 'production') ? require('./exports.webpack.prod.js')(webpack) :
    require('./exports.webpack.dev.js')(webpack);
 
if (envWebpack) {
    if (typeof envWebpack.entry !== 'undefined') {
        webpackConfig.entry = mergeObject(webpackConfig.entry, envWebpack.entry);
    }
    
    if (Array.isArray(envWebpack.plugins)) {
        webpackConfig.plugins = (webpackConfig.plugins).concat(envWebpack.plugins);
    }
}
*/

module.exports = webpackConfig;