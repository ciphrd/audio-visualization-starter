const webpack = require('webpack');
const dev = process.env.NODE_ENV === 'dev';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


let config = 
{
  entry: `${__dirname}/src/main.js`,

  output: 
  {
    path: `${__dirname}/dist/`,
    filename: `app.js`,
    publicPath: "/dist/"
  },
  
  //devtool: "cheap-module-eval-source-map",

  module: 
  {
    loaders: [
      {
        test: /\.js$/,
        exclude: `${__dirname}/nodes_modules/`,
        loader: 'babel-loader',
        query: {
          presets: ['babel-preset-env'],
          cacheDirectory: true
        }
      }
    ]
  },

  plugins: [
  ],

  resolve: 
  {
    modules: [`${__dirname}/node_modules/`],
    alias: {
      'dat.gui': 'dat.gui/build/dat.gui'
    }
  },

  stats:
  {
    colors: true
  }

}

if (!dev) 
{
  config.plugins.push( new UglifyJSPlugin() );
}

module.exports = config;