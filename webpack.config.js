'use strict';

// external deps
var _ = require('lodash');
var minimist = require('minimist');
var chalk = require('chalk');

// plugins
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

// node internal deps
var path = require('path');


var DEFAULT_TARGET = 'TEST';


var DEFAULT_PARAMS = {
  // Initialize module
  module: {
    preLoaders: [
      {
        test: /\.tsx?$/,
        exclude: /(bower_components|node_modules|\.spec\.)/, // exclude any and all files in the node_modules folder
        loader: 'tslint'
      }
    ],
    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    loaders: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.tsx?$/,
      loader: 'ng-annotate?add=true!awesome-typescript-loader',
      include: [
        path.resolve(__dirname, 'src')
      ]
    }, {
      test: /\.jade$/,
      loader: 'jade'
    }]
  },
  resolve: {
    modulesDirectories: [
      'web_modules',
      'node_modules',
      'bower_components'
    ]
  }
};

var entries = {
  vendorsCore: [
    'angular',
    'angular-translate',
    'tpl.scope-listener-manager/dist/tpl.scope-listener-manager'
  ]
};

var PARAMS_PER_TARGET = {
  // preLoaders: [{
  //   // ISPARTA LOADER
  //   // Reference: https://github.com/ColCh/isparta-instrumenter-loader
  //   // Instrument JS files with Isparta for subsequent code coverage reporting
  //   // Skips node_modules and files that end with .test.js
  //   test: /\.js$/,
  //   exclude: [
  //     /node_modules/,
  //     /\.test\.js$/
  //   ],
  //   loader: 'isparta-instrumenter'
  // }],
  TEST: {
    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    entry: entries,
    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    output: {
      // Absolute output directory
      path: __dirname + '/dist',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: 'http://localhost:8080/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: '[name].bundle.js'
    },
    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    devtool: 'source-map'
    // plugins: [
    //   // Reference: https://github.com/webpack/extract-text-webpack-plugin
    //   // Extract css files
    //   // Disabled when in test mode or not in build mode
    //   new ExtractTextPlugin('styles/[hash].css')
    // ],
    // module: {
    //   loaders: [{
    //     // CSS LOADER
    //     // Reference: https://github.com/webpack/css-loader
    //     // Allow loading css through js
    //     //
    //     // Reference: https://github.com/postcss/postcss-loader
    //     // Postprocess your css with PostCSS plugins
    //     test: /\.css$/,
    //     // Reference: https://github.com/webpack/extract-text-webpack-plugin
    //     // Extract css files in production builds
    //     //
    //     // Reference: https://github.com/webpack/style-loader
    //     // Use style-loader in development for hot-loading
    //     loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
    //   }]
    // }
  }
};


var target = _resolveBuildTarget(DEFAULT_TARGET);
var params = _.mergeWith(DEFAULT_PARAMS, PARAMS_PER_TARGET[target], _mergeArraysCustomizer);

_printBuildInfo(target, params);

module.exports = params;




function _resolveBuildTarget(defaultTarget) {
  var target = minimist(process.argv.slice(2)).TARGET;
  if (!target) {
    console.log('No build target provided, using default target instead\n\n');
    target = defaultTarget;
  }
  return target;
}

function _printBuildInfo(target, params) {
  console.log('\nStarting ' + chalk.bold.green('"' + target + '"') + ' build');
  if (target === 'DEV') {
    console.log('Dev server: ' + chalk.bold.yellow(params.output.publicPath.substring(0, params.output.publicPath.indexOf(':', 7) + 1) + (params.devServer.port || 8080)) + '\n\n');
  } else {
    console.log('\n\n');
  }
}

function _mergeArraysCustomizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
