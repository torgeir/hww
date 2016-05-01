var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {

  entry: {
    app: ['./js/index']
  },

  output: {
    path: __dirname + '/dist/',
    filename: './[name].bundle.js',
    publicPath: '/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'hww',
      template: 'index-template.html',
      inject: 'body',
      hash: true
    }),
    new webpack.NoErrorsPlugin({ bail: true })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'js'),
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: [
            'transform-react-require',
            'transform-object-rest-spread'
          ],
          presets: [ 'es2015', 'react' ]
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.png$/,
        loader: "url-loader"
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader?sourceMap",
          "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
          "postcss-loader"
        ]
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },

  postcss: [ autoprefixer ],

};
