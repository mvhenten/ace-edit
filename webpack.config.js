const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      }        
    ]
  },
  resolve: {
    extensions: [
      '.less',
      '.tsx',
      '.ts',
      '.js'
    ]
  }
};

module.exports = config;