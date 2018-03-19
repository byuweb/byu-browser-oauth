// Karma configuration
// Generated on Fri Mar 16 2018 16:09:15 GMT-0600 (MDT)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'detectBrowsers'],


    // list of files / patterns to load in the browser
    files: [
      {
        pattern: '*_test.js',
        watched: false,//Our rollup preprocessor handles watching
      },
      {
        pattern: 'byu-browser-oauth.js',
        included: false,
      }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*_test.js': ['rollup'],
    },

    rollupPreprocessor: {
      output: {
        format: 'iife',
        name: 'byuBrowserOauth',
        sourcemap: 'inline',
      }
    },

    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function(available) {
        const result = available;
        console.log(available);
        const chrome = available.indexOf('Chrome');
        if (chrome > -1) {
          result.splice(chrome, 1, 'ChromeHeadless')
        }
        return result;
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox', 'Safari', 'IE'],
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}