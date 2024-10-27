/**
 * This file extends the default WordPress Gutenberg webpack config
*/
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' ); // Default WordPress Gutenberg config
const Dotenv = require('dotenv-webpack');
const path = require( 'path' );

// Add extra configuration, and export it
module.exports = {
  ...defaultConfig,
  entry:{
    ...defaultConfig.entry,
    index: path.resolve( process.cwd(), 'src', 'index.js' ),
    classicEditorIndex: path.resolve( process.cwd(), 'src', 'classicEditorIndex.js' )
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      // Add here a new rule
      // ...
    ],
  },
  plugins: [
    ...defaultConfig.plugins,
    new Dotenv()
  ]
};