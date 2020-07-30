const path = require('path');
const webpack = require('webpack');

let production = false;

module.exports = {
    mode: production ? "production" : "development",
    context: process.cwd(),
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.sass', '.css'],
        modules: [__dirname, 'node_modules']
    },
    entry: {
        library: [
            //util
            //'jquery', removed may be re-added in future
            'axios',

            //react :sunglasses:
            'react',
            'react-dom',
            'react-dom/server',

            //dont want the main webpack file to be cluttered OCD OK
            '@babel/runtime/helpers/interopRequireDefault.js',
            '@babel/runtime/helpers/interopRequireWildcard.js',

            //ant design stuff will support dark mode in production versions soon only dev builds rn ok bruh
            'antd',
            'antd/dist/antd.dark.min.css',
            //'antd/dist/antd.dark.min.css',
            '@ant-design/icons/lib/components/AntdIcon.js',
            '@ant-design/icons/es/index.js',

            //plots will add implement in future
            //'@antv/g2plot',
        ]
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                loader: ['url-loader']
            },
        ],
    },
    devtool: 'source-map',
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, './src/public/library'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: './src/public/library/[name].json'
        }),
    ]
};
