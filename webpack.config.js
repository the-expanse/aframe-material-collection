const path = require('path');
module.exports = {
    entry: "./src/index.js",
    mode:"development",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    devServer: {
        stats: "errors-only",
        contentBase: __dirname+"/dist",
        open:true
    },
};