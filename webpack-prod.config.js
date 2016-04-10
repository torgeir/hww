var webpack = require('webpack');

var webpackConfig = require('./webpack-base.config');

module.exports = {

  entry: webpackConfig.entry,

  resolve: webpackConfig.resolve,

  output: webpackConfig.output,

  postcss: webpackConfig.postcss,

  plugins: webpackConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify("production") }
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]),

  module: webpackConfig.module
};
