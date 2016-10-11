/**
 * @file WebPack Configuration
 */

'use strict';

const pkg     = require('./package.json');
const webpack = require('webpack');

module.exports = {
  entry: {
    'skewslider.js'     : './src/skewSlider.ts',
    'docs/skewslider.js': './src/skewSlider.ts'
  },
  output: {
    filename     : '[name]',
    library      : 'SkewSlider',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.ts']
  },
  plugins: [
    new webpack.BannerPlugin(` skewSlider.js v${ pkg.version }
${ pkg.repository.url }

Copyright (c) ${ new Date().getFullYear() } ${ pkg.author }
Licensed under the MIT license.

`)
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test   : /\.ts$/,
        loader : 'ts',
        exclude: [
          /node_modules/
        ]
      }
    ]
  }
};
