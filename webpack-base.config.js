var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
console.log(__dirname);

module.exports = {

  entry: {
    app: ['./js/index']
  },

  output: {
    path: __dirname + '/dist/',
    filename: './[name].bundle.js',
    publicPath: ''
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
        test: /\.less$/,
        loaders: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader?strictMath&cleancss"
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  }

};
