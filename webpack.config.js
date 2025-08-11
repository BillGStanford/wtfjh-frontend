const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:5000/api'),
        REACT_APP_BASE_URL: JSON.stringify(process.env.REACT_APP_BASE_URL || 'http://localhost:3000'),
        REACT_APP_APP_NAME: JSON.stringify(process.env.REACT_APP_APP_NAME || 'WTF Just Happened'),
        REACT_APP_MAX_STORY_LENGTH: JSON.stringify(process.env.REACT_APP_MAX_STORY_LENGTH || '500'),
        REACT_APP_MAX_TITLE_LENGTH: JSON.stringify(process.env.REACT_APP_MAX_TITLE_LENGTH || '100'),
      }
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};