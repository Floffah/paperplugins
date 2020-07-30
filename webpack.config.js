const webpack = require('webpack');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const Ocap = require("optimize-css-assets-webpack-plugin");
const HtmlPlugin = require('html-webpack-plugin');
const CspPlugin = require('csp-html-webpack-plugin');
const AddAssetPlugin = require('add-asset-html-webpack-plugin');

let production = false;

const babelopts = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-react",
    ],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties"
    ],
    env: {
        production: {
            only: ["wsrc"],
            plugins: [
                [
                    "transform-react-remove-prop-types",
                    {
                        removeImport: true
                    }
                ],
                "@babel/plugin-transform-react-inline-elements",
                "@babel/plugin-transform-react-constant-elements"
            ]
        }
    }
}

const postcssopts = {
    plugins: [
        require('postcss-import'),
        require('postcss-preset-env'),
        require('cssnano'),
        require('autoprefixer')({
            overrideBrowserslist: [
                "defaults",
                "last 1 version",
                "> 1%",
                "not IE 11",
                "not IE_Mob 11",
                "maintained node versions"
            ]
        }),
    ],
}

module.exports = {
    mode: production ? "production" : "development",
    entry: "./src/web/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'src/public'),
        publicPath: "/media/",
        library: "PaperPlugins",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: babelopts
                }],
            },
            {
                test: /\.s[ac]ss$/,
                use: (() => {
                    if(production) {
                        return [
                            {loader: 'style-loader'},
                            {loader: 'css-loader'},
                            {loader: 'postcss-loader', options: postcssopts},
                            {loader: 'sass-loader'}
                        ]
                    } else {
                        return [
                            {loader: 'style-loader'},
                            {loader: 'css-loader'},
                            {loader: 'sass-loader'}
                        ]
                    }
                })()
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                loader: ['url-loader']
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./src/public/library/library.json')
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlPlugin({
            title: 'Paper Plugins',
            hash: true,
            template: "src/web/html/index.html"
        }),
        new CspPlugin({
            //"default-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
            //"img-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'", "*.unsplash.com", "unsplash.com"],
            'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'", "moz-extension://*.js"],
            //'frame-src': ["http://51.222.22.1:8125/"]
        }, {
            hashingMethod: "sha256",
            hashEnabled: true,
            nonceEnabled: true,
        }),
    ],
    devtool: 'source-map',
    optimization: {
        minimize: production,
        minimizer: [new TerserPlugin(), new Ocap()]
    }
}
