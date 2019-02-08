
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: [/*'parallel', */'jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-mocha-reporter'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      // require('karma-parallel')
    ],
    // parallelOptions: {
    //   executors: (Math.ceil(require('os').cpus().length)),
    //   shardStrategy: 'round-robin'
    // },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      /*thresholds: {
        statements: 86,
        lines: 86,
        branches: 80,
        functions: 82
      }*/
    },
    reporters: ['progress', 'kjhtml'],
    // mochaReporter: {
    //   output: 'minimal'
    // },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333']
      }
    },
    singleRun: false,
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout: 210000,
    browserNoActivityTimeout: 210000,
    angularCli: {
      environment: 'dev',
      sourcemaps: false
    }
  });
};
