const path = require('path');
const webpack = require('webpack');


module.exports = 
{

  mode: 'production',
  
  entry: `./src/main.js`,

  output: 
  {
    path: path.resolve(__dirname, '../dist'),
    filename: `app.js`,
    publicPath: "/dist/"
  },

  module: 
  {
    rules: [
      {
        test: /\.js$/,
        exclude: /nodes_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },

  resolve: 
  {
    modules: [ path.resolve(__dirname, '../node_modules') ],
    alias: {
      'dat.gui': 'dat.gui/build/dat.gui'
    }
  },

}