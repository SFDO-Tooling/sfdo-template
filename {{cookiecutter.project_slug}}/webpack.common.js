/* eslint-disable no-process-env */

'use strict';

process.env.BROWSERSLIST_CONFIG = './.browserslistrc';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: path.join(__dirname, 'src', 'js'),
  entry: {
    app: ['whatwg-fetch', 'js/index', 'sass/app.scss'],
    sentry: 'js/sentry',
  },
  resolve: {
    modules: ['src', 'static', 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.join(__dirname, 'src', 'js'),
      '#': path.join(__dirname, 'static', 'images'),
    },
  },
  output: {
    publicPath: '/static/',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/](?!@sentry)/,
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [
          path.join(__dirname, 'src/js'),
          path.join(__dirname, 'node_modules/@salesforce/design-system-react'),
        ],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(svg|gif|jpe?g|png)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000 },
          },
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 30 },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: path.join(__dirname, 'src', 'index.html'),
    }),
  ],
};
