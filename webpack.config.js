let webpack = require('webpack');
let path = require('path');

let BUILD_DIR = path.resolve(__dirname, 'src', 'js', 'main');
let APP_DIR 	=  path.resolve(__dirname, 'public', 'build');

module.exports = {
    entry: [
      BUILD_DIR
    ],
    output: {
      path: APP_DIR,
      filename: 'main.bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    stats: {
      colors: true
    },
    devtool: 'source-map'
};
