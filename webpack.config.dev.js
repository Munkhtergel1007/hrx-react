let path = require('path');
let webpack = require('webpack');
// import "core-js/stable";
import "regenerator-runtime/runtime";
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        front: [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './front/index')
        ],
        admin: [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './admin/index')
        ],
        company: [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './company/index')
        ]
    },
    output: {
        path: path.resolve(__dirname, './static/dist'),
        filename: "[name].js",
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        })
    ],
    module: {
        noParse: [/jszip.js$/],
        rules: [
            {
                test: /\.(js|jsx)?$/,
                include: [path.resolve(__dirname, './front'), path.resolve(__dirname, './admin'), path.resolve(__dirname, './company')],
                loaders: ['babel-loader']
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"}, {loader: "css-loader"}
                ]
            },{
                test: /\.(woff|woff2|ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            }
        ]
    }
};
