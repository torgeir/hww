var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

var webpackConfig = require('./webpack-base.config');

module.exports = {

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3001',
    'webpack/hot/only-dev-server'
  ].concat(webpackConfig.entry.app),

  resolve: webpackConfig.resolve,

  output: webpackConfig.output,

  postcss: webpackConfig.postcss,

  plugins: webpackConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify("development") }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackNotifierPlugin()
  ]),

  module: {
    preLoaders: [{ loader: 'eslint-loader', test: /\.js$/, include: path.join(__dirname, 'js'), exclude: /vendor/ }],
    loaders: [{ loader: 'react-hot', test: /\.js$/, include: path.join(__dirname, 'js') }]
      .concat(webpackConfig.module.loaders)
  }
};