"use strict";

var path = require("path");

var CWD = process.cwd();

module.exports = {
  devServer: {
    contentBase: "./demo",
    noInfo: false
  },

  output: {
    path: "./demo",
    filename: "main.js",
    publicPath: "/assets/"
  },

  cache: true,
  devtool: "cheap-eval-source-map",
  entry: {
    app: ["./demo/app.jsx"]
  },
  stats: {
    assets: false,
    children: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
    resolve: {
      alias: {
        "react": path.join(CWD, '/node_modules/react'),
        "react-dom": path.join(CWD, '/node_modules/react-dom'),
        "react/addons": path.join(CWD, '/node_modules/react/addons'),
      }
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: "babel-loader",
        query: {
          cacheDirectory: true
        }
      }
    ]
  }
};
