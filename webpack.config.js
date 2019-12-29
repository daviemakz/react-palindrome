'use strict';

// Declare node enviroment
process.env.NODE_ENV = 'production';

// Declase browser configuration
const browserConfig = {
  mode: 'production',
  entry: './src/client/index.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  devtool: 'none',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  module: {
    rules: [
      {
        test: /js|jsx$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: { presets: ['react-app'] }
      }
    ]
  },
  plugins: []
};

module.exports = [browserConfig];
