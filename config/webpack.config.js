'use strict';

var path = require('path');
var webpack = require('webpack');

var CWD = process.cwd();
var SRC = path.join(ROOT, 'src');

module.exports = {
  cache: true,
  context: path.join(CWD, 'src'),
  entry: './index.js',
  output: {
    path: path.join(CWD, 'dist'),
    filename: 'treedux.min.js',
    library: 'treedux',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [SRC],
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
};
