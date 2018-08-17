const path = require('path');
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        "aframe-material-collection": "./src/index.js",
        "aframe-material-collection.min": "./src/index.js",
        // "aframe-yoga-layout": "./src/yoga.js",
        // "aframe-yoga-layout.min": "./src/yoga.js",
        "aframe-material-collection_curved-plane.min": "./src/public-components/curved-plane.js",
        "aframe-material-collection_switch.min": "./src/public-components/switch.js",
        "aframe-material-collection_toast.min": "./src/public-components/toast.js",
        "aframe-material-collection_buttons.min": "./src/public-components/buttons.js",
        "aframe-material-collection_checkbox.min": "./src/public-components/checkbox.js",
        "aframe-material-collection_radio.min": "./src/public-components/radio.js",
        "aframe-material-collection_input.min": "./src/public-components/input.js",
        "aframe-material-collection_renderer.min": "./src/public-components/renderer.js",
        "aframe-material-collection_scroll-pane.min": "./src/public-components/scroll-pane.js"
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