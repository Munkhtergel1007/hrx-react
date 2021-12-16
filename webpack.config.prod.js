var path = require('path');
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
module.exports = {
    mode: 'production',
    entry: {
        front: [
            './front/index'
        ],
        admin: [
            './admin/index'
        ],
        company: [
            './company/index'
        ]
    },
    output: {
        path: path.resolve(__dirname, './static/dist'),
        filename: "[name].[hash].js",
        chunkFilename: '[id]-[chunkhash].js',
        publicPath: '/dist/'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new WebpackAssetsManifest({
            output: `${path.resolve(__dirname, './static/')}/manifest.json`,
            merge: true,
            publicPath: '/dist/'
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            })
        ],
    },
    module: {
        noParse: [/jszip.js$/],
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, './front'), path.resolve(__dirname, './admin'), path.resolve(__dirname, './company')]
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
            },
            {
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
