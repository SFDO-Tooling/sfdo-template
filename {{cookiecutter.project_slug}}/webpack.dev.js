/* eslint-disable no-process-env */

'use strict';

process.env.NODE_ENV = 'development';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SizePlugin = require('size-plugin');
const common = require('./webpack.common.js');
const convert = require('koa-connect');
const fs = require('fs');
const merge = require('webpack-merge');
const path = require('path');
const proxy = require('http-proxy-middleware');
const webpackServeWaitpage = require('webpack-serve-waitpage');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-inline-source-map',
  serve: {
    devMiddleware: { writeToDisk: true },
    https: {
      // eslint-disable-next-line no-sync
      key: fs.readFileSync(path.join(__dirname, 'cert.key')),
      // eslint-disable-next-line no-sync
      cert: fs.readFileSync(path.join(__dirname, 'cert.crt')),
    },
    hotClient: {
      port: 5000,
    },
    add: (app, middleware, options) => {
      app.use(
        webpackServeWaitpage(options, {
          title: '{{cookiecutter.project_name}}',
          theme: 'material',
        }),
      );
      app.use(
        convert(
          proxy({
            target: 'https://localhost:8000',
            secure: false,
          }),
        ),
      );
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*.*']),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new SizePlugin(),
  ],
});
