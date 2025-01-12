const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = {
  ...config,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'plugins'),
    filename: 'bundle.js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process': JSON.stringify({
        env: {
          NODE_ENV: 'production'
        },
        browser: true
      })
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom'
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: 'public/manifest.firefox.json', 
          to: 'manifest.json' 
        },
        { from: 'public/icon16.png', to: 'icon16.png' },
        { from: 'public/icon32.png', to: 'icon32.png' },
        { from: 'public/icon48.png', to: 'icon48.png' },
        { from: 'public/icon128.png', to: 'icon128.png' },
        { from: 'public/background.js', to: 'background.js' },
        { from: 'public/index.html', to: 'index.html' },
        { from: 'public/styles.css', to: 'styles.css' },
        { from: 'public/content.js', to: 'content.js' }
      ],
    }),
  ],
  optimization: {
    minimize: false // 禁用压缩以便于调试
  }
}; 