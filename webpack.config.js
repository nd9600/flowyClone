const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./static/js/tasks"),
        publicPath: "static/js/tasks/",
        filename: "build.js",
        pathinfo: false
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader"
                ],
            }, {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    // name: '[name].[ext]?[hash]'
                    name: "[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        // new webpack.HashedModuleIdsPlugin(),
        new VueLoaderPlugin()//,
        //new HardSourceWebpackPlugin()
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        },
        extensions: ["*", ".js", ".vue", ".json"]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({ 
                uglifyOptions: { 
                    compress: false, 
                    mangle: true 
                }
            })
        ],
        splitChunks: false
        // runtimeChunk: {
        //     name: "runtime"
        // },
        // splitChunks: {
        //     cacheGroups: {
        //         vendor: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: "vendors",
        //             chunks: "all",
        //             minChunks: 1
        //         }
        //     }
        // }
    },
    devServer: {
        compress: false,
        noInfo: false,
        overlay: true
    },
    performance: {
        hints: false
    },
    devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "#source-map";
    // module.exports.devtool = false;
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}