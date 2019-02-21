const webpackConfig = require("./webpack.config");

module.exports = function (config) {
    config.set({
        frameworks: ['mocha','chai'],
        files: [
            { pattern: 'https://aframe.io/releases/0.9.0/aframe.min.js', watched: false},
            { pattern: 'test/**/*.ts', watched: true }
        ],
        preprocessors: {
            'test/**/*.ts': [ 'webpack' ]
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
            externals: webpackConfig.externals
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],
        autoWatch: true,
        singleRun: false,
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },
    })
}