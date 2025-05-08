const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('js')
      .exclude
      .add(path.resolve(__dirname, 'node_modules/@cesdk/cesdk-js'))
      .add(path.resolve(__dirname, 'node_modules/@cesdk/engine'))
      .end();
  }
})
