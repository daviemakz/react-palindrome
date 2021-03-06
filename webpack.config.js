'use strict';

// Load NPM modules
const Path = require('path');

// Load plugins
const RunNodeWebpackPlugin = require('run-node-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const NodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Declare node enviroment
process.env.NODE_ENV = 'development';

// Proxy server, we will use webpack as a reverse proxy
const host = 'localhost';
const port = 8080;
const serverProxyPath = 'http://localhost:3000';

// Settings include server & reverse proxy
const devServer = {
  proxy: {
    '/api/**': {
      target: serverProxyPath,
      secure: false,
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
      cookieDomainRewrite: '',
      logLevel: 'debug',
      headers: {
        host: serverProxyPath,
        referer: serverProxyPath,
        origin: serverProxyPath.slice(0, -1)
      }
    }
  },
  host,
  port,
  hot: false,
  features: [
    'before',
    'setup',
    'headers',
    'middleware',
    'contentBaseFiles',
    'proxy',
    'magicHtml',
    'contentBaseIndex'
  ],
  disableHostCheck: true,
  writeToDisk: filePath => {
    return /server\.js$/.test(filePath);
  }
};

// Define resolve settings
const resolve = {
  modules: ['node_modules', Path.resolve(__dirname)],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
};

// What source maps you want?
const devtool = 'cheap-module-source-map';

// Define the output path
const output = {
  path: Path.resolve(__dirname, 'public'),
  filename: '[name].js'
};

// Declare express configuration, we need to do this as they will have different targets
const serverConfig = {
  mode: 'development',
  entry: {
    server: 'src/server/index.js'
  },
  output,
  devtool,
  externals: [NodeExternals()], // Need this to avoid error when working with Express
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  resolve,
  module: {
    rules: [
      {
        test: /js|jsx$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer,
  plugins: [
    new RunNodeWebpackPlugin({
      scriptToRun: 'server.js',
      runOnlyOnChanges: true,
      scriptsToWatch: ['server.js']
    })
  ]
};

// Declase browser configuration
const browserConfig = {
  mode: 'development',
  entry: {
    app: 'src/client/index.jsx'
  },
  output,
  target: 'web',
  devtool,
  resolve,
  module: {
    rules: [
      {
        test: /js|jsx$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  devServer,
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      dry: true
    }),
    new HtmlWebPackPlugin({
      template: './src/client/index.html',
      filename: 'index.html',
      excludeChunks: ['server']
    })
  ]
};

module.exports = [serverConfig, browserConfig];
