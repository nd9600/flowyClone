const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

// const mode = "development"; // change this to change the version of Vue that's loaded
const mode = "production";

module.exports = {
    mode: mode || "production",
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./static/js/tasks"),
        publicPath: "static/js/tasks/",
        filename: "build.js"
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
                exclude: /node_modules/
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
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        },
        extensions: ["*", ".js", ".vue", ".json"]
    },
    optimization: {
        minimize: true,
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
        historyApiFallback: true,
        noInfo: false,
        overlay: true
    },
    performance: {
        hints: false
    }
};

if (mode === "production") {
    module.exports.devtool = "source-map";
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
} else {
    module.exports.devtool = "eval-source-map";
}