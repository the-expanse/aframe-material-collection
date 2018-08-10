const path = require('path');
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        "aframe-material-collection": "./src/index.js",
        "aframe-material-collection.min": "./src/index.js",
        // "aframe-yoga-layout": "./src/yoga.js",
        // "aframe-yoga-layout.min": "./src/yoga.js",
    },
    mode:"development",
    devtool: "source-map",
    output: {
        path: __dirname+"/dist",
        filename: "[name].js"
    },
    devServer: {
        stats: "errors-only",
        contentBase: __dirname+"/dist",
        open:true
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    }
};