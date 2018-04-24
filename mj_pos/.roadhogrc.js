const path = require('path');
var pxtorem = require('postcss-pxtorem');
export default {
    entry: "src/index.js",
    publicPath: "/pos/",
    disableCSSModules: true,
    env: {
        development: {
            extraBabelPlugins: [
                "dva-hmr",
                "transform-runtime",
                "transform-class-properties",
                'transform-decorators-legacy',
                ["import", { "libraryName": "antd", "style": true }]
            ],
            proxy: [
                {
                    context: ['/pos'],
                    target: "http://local.api.liandaxia.com",
                    secure: false,
                    changeOrigin: true
                }
            ]
        },
        production: {
            extraBabelPlugins: [
                "transform-runtime",
                ["import", { "libraryName": "antd", "style": true }],
            ]
        }
    }
}