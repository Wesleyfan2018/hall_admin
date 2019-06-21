'use strict';
const path = require('path');
const port = 9527; // dev port

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    // publicPath: process.env.NODE_ENV === 'produvtion'
    //   ? '/production-sub-path/'
    //   : '/main',
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
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   '/api': {
    //     target: 'http://192.168.8.229', // 设置你调用的接口域名和端口号
    //     changeOrigin: true,     // 跨域
    //     pathRewrite: {
    //       '^/api': '/'
    //     }
    //   }
    // },
    },
    configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
        name: 'hall data',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: config => {
    /* config.module
      .rule('images')
      .use('url-loader')
        .loader('url-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        }) */
    },
    // css相关配置
    css: {
    // 启用 CSS modules
        modules: false,
        // 是否使用css分离插件
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {}
    },

    // PWA 插件相关配置
    pwa: {},
    // 第三方插件配置
    pluginOptions: {
    }
};
