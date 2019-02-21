const path = require('path');
const webpack = require("webpack");
const WorkerLoader = require('worker-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        "aframe-material-collection": "./src/index.ts",
        "aframe-material-collection.min": "./src/index.ts",
        "aframe-yoga-layout": "./src/yoga.js",
        "aframe-yoga-layout.min": "./src/yoga.js"
        /*"aframe-material-collection_curved-plane.min": "./src/public-components/curved-plane.js",
        "aframe-material-collection_switch.min": "./src/public-components/switch.js",
        "aframe-material-collection_slider.min": "./src/public-components/slider.js",
        "aframe-material-collection_number.min": "./src/public-components/number.js",
        "aframe-material-collection_toast.min": "./src/public-components/toast.js",
        "aframe-material-collection_buttons.min": "./src/public-components/buttons.js",
        "aframe-material-collection_checkbox.min": "./src/public-components/checkbox.js",
        "aframe-material-collection_radio.min": "./src/public-components/radio.js",
        "aframe-material-collection_input.min": "./src/public-components/input.js",
        "aframe-material-collection_renderer.min": "./src/public-components/renderer.js",
        "aframe-material-collection_scroll-pane.min": "./src/public-components/scroll-pane.js"*/
     },
    mode:"development",
    devtool: "source-map",
    resolve: {
        extensions: [ '.ts', ".js"]
    },
    output: {
        path: __dirname+"/dist",
        filename: "[name].js"
    },
    devServer: {
        stats: "errors-only",
        contentBase: __dirname+"/dist",
        open:true
    },
    module: {
        rules: [
            {
                test: /\.worker\.ts$/,
                use: { loader: 'worker-loader', options: { inline: true, fallback: false, publicPath: '/' } }
            }, {
                test: /\.ts?$/,
                exclude: [/(node_modules)/,/(node)/,/(lib)/],
                loader: "ts-loader"
            }
        ]
    },
    externals: {
        three: 'THREE',
        aframe: 'AFRAME'
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    }
};