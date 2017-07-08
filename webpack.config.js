const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV || 'dev';
const devtool = (env !== 'production') ? 'eval' : undefined;

// production
const plugins = [];
// if (env === 'production') {
//   plugins.push( new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, screw_ie8: true }}));
// }

var libraryDesc = require('./package.json').library;
var libraryEntryPoint = path.join(__dirname, 'src', libraryDesc.entry);
module.exports = {
  devtool,
  entry: libraryEntryPoint,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'ind',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [
	path.resolve(__dirname, 'src'),
	path.resolve(__dirname, 'node_modules'),
	path.resolve(__dirname, 'node_modules/react-redux/node_modules')
    ]
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.js?$/,
        loaders: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      }
    ]
  }
};
