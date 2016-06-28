'use strict';

// external deps
var _ = require('lodash');
var minimist = require('minimist');
var chalk = require('chalk');

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// node internal deps
var path = require('path');


var DEFAULT_TARGET = 'TEST';

var ROOT_PATH = 'src';
var BOOTSTRAP_PATH = 'bootstrap';
var ENV_CONFIGURATION = require('./src/bootstrap/env.json');


var DEFAULT_PARAMS = {
  // Initialize module
  module: {
    preLoaders: [
      /**
      * Tslint loader support for *.ts files
      *
      * See: https://github.com/wbuchwalter/tslint-loader
      */
      {
        test: /\.tsx?$/,
        loader: 'tslint',
        exclude: /(node_modules|\.spec\.)/
      }
    ],
    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    loaders: [{
      // TS LOADER
      // Transpile .ts/.tsx files using ts-loader
      test: /\.tsx?$/,
      loader: 'ng-annotate?add=true!awesome-typescript-loader',
      include: [
        path.resolve(__dirname, ROOT_PATH)
      ],
      exclude: [/\.e2e\-spec\.ts$/]
    }, {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      loader: 'raw',
      exclude: /index\.html/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.jade$/,
      loader: 'jade'
    }, { /* BOOTSTRAP ICON FONT */
      test: /\.(svg|woff|woff2|ttf|eot)$/,
      loader: 'file?name=assets/fonts/[hash].[ext]',
      include: /(glyphicons|edl\-tbl\-font)/ /* END BOOTSTRAP ICON FONT */
    }, { /* FONT AWESOME */
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff&name=assets/fonts/[hash].[ext]',
      include: /fontawesome/
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff&name=assets/fonts/[hash].[ext]',
      include: /fontawesome/
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream&name=assets/fonts/[hash].[ext]',
      include: /fontawesome/
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file?name=assets/fonts/[hash].[ext]',
      include: /fontawesome/
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml&name=assets/fonts/[hash].[ext]',
      include: /fontawesome/
    }]
  },
  /**
   * Static analysis linter for TypeScript advanced options configuration
   * Description: An extensible linter for the TypeScript language.
   *
   * See: https://github.com/wbuchwalter/tslint-loader
   */
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: ROOT_PATH
  },
  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  postcss: [
    require('postcss-sorting')(),
    require('stylelint')(), // or: require('stylefmt')
    require('postcss-import')({
      path: [
        __dirname + '/' + ROOT_PATH,
        __dirname + '/bower_components',
        __dirname + '/node_modules'
      ]
    }),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-assets-rebase')({
      assetsPath: './assets',
      relative: true
    }),
    require('postcss-reporter')(),
    autoprefixer({
      browsers: ['last 4 versions']
    })
  ],
  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.jade', '.html'],
    modulesDirectories: [
      'web_modules',
      'node_modules',
      'bower_components'
    ]
  },
  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    contentBase: './dist',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  }
};

var entries = {
  vendor: './' + ROOT_PATH + '/' + BOOTSTRAP_PATH + '/vendor.ts',
  polyfills: './' + ROOT_PATH + '/' + BOOTSTRAP_PATH + '/polyfills.ts',
  main: './' + ROOT_PATH + '/' + BOOTSTRAP_PATH + '/main.ts'
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
    devtool: 'source-map',
    module: {
      loaders: [{
        test: /\.css$/,
        loader: 'null'
      }]
    }
  },
  DEV: {
    metadata: ENV_CONFIGURATION,
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
      publicPath: ENV_CONFIGURATION.baseUrl, // Hint: has to be http://your-local-ip:8080 for remote access via network

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
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: ['main', 'vendor', 'polyfills'],
        filename: 'scripts/vendor/[hash]_[name].js'
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files
      // Disabled when in test mode or not in build mode
      new ExtractTextPlugin('styles/[hash].css'),
      // Reference: https://github.com/ampedandwired/html-webpack-plugin
      // Render index.html
      new HtmlWebpackPlugin({
        template: './' + ROOT_PATH + '/index.html',
        inject: 'body',
        chunksSortMode: packageSort(['polyfills', 'vendor', 'main'])
      })
    ],
    module: {
      loaders: [{
        // CSS LOADER
        // Reference: https://github.com/webpack/css-loader
        // Allow loading css through js
        //
        // Reference: https://github.com/postcss/postcss-loader
        // Postprocess your css with PostCSS plugins
        test: /\.css$/,
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files in production builds
        //
        // Reference: https://github.com/webpack/style-loader
        // Use style-loader in development for hot-loading
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
      }]
    }
  }
};


var target = _resolveBuildTarget(DEFAULT_TARGET);
var params = _.mergeWith(DEFAULT_PARAMS, PARAMS_PER_TARGET[target], _mergeArraysCustomizer);

_printBuildInfo(target, params);

module.exports = params;




////////////
// HELPER //
////////////
function packageSort(packages) {
  var len = packages.length - 1;
  var first = packages[0];
  var last = packages[len];
  return function sort(a, b) {
    // polyfills always first
    if (a.names[0] === first) {
      return -1;
    }
    // main always last
    if (a.names[0] === last) {
      return 1;
    }
    // vendor before app
    if (a.names[0] !== first && b.names[0] === last) {
      return -1;
    } else {
      return 1;
    }
  };
}

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
////////////////
// END HELPER //
////////////////
