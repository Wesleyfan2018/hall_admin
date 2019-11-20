const path = require('path');
const port = 9527; // dev port
const CompressionPlugin = require('compression-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // js文件压缩
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    // publicPath: process.env.NODE_ENV === 'produvtion'
    //   ? '/production-sub-path/'
    //   : '/main',
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    indexPath: 'index.html',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    // webpack-dev-server 相关配置
    devServer: {
        port: port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: 'hall data',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new CompressionPlugin({
                // CompressionPlugin 启用压缩
                test: /\.js$|\.html$|\.css/, // 匹配文件名
                threshold: 10240, // 对超过10k的数据进行压缩
                minRatio: 0.8,
                deleteOriginalAssets: false // 是否删除源文件
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8889,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            })
        ],
        externals: {
            // 'echarts': 'echarts', // 配置使用CDN
            vue: 'Vue',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            axios: 'axios',
            'element-ui': 'ELEMENT',
            'js-md5': 'md5'
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload'); // TODO: need test
        config.plugins.delete('prefetch'); // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true;
                return options;
            })
            .end();

        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development', config =>
                config.devtool('cheap-source-map')
            );

        config.when(process.env.NODE_ENV !== 'development', config => {
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        // `runtime` must same as runtimeChunk name. default is `runtime`
                        inline: /runtime\..*\.js$/
                    }
                ])
                .end();
            config.runtimeChunk = true;
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // only package third parties that are initially dependent
                    },
                    // elementUI: {
                    //     name: 'chunk-elementUI', // split elementUI into a single package
                    //     priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                    //     test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                    // },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            });
            config.optimization.runtimeChunk('single');
        });
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 启用 CSS modules
        modules: false,
        // 是否使用css分离插件
        // extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {}
    },

    // PWA 插件相关配置
    pwa: {
        manifestPath: 'manifest.json',
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    // 第三方插件配置
    pluginOptions: {}
};
