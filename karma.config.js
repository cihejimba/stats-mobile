'use strict';

module.exports = function(config) {
    config.set({

        // base path, set so our root is the root directory
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'
        ],

        //preprocessors: {
        //    'www/js/**/*.js': ['coverage']
        //},

        // list of files / patterns to load in the browser
        files: [
            'www/lib/ionic/js/ionic.bundle.js',
            'www/lib/a0-angular-storage/dist/angular-storage.js',
            'www/lib/angular-jwt/dist/angular-jwt.js',
            'www/lib/angular-messages/angular-messages.js',
            'www/lib/d3/d3.min.js',
            'www/lib/nvd3/nv.d3.min.js',
            'www/lib/angular-nvd3/dist/angular-nvd3.min.js',
            'www/lib/angular-mocks/angular-mocks.js',
            'www/lib/ngCordova/dist/ng-cordova.min.js',
            'www/dist/app.js',
            'www/dist/templates.js',
            'www/dist/statracker.js',
            //'test/*.js',
            'test/**/*.js'
        ],

        exclude: [ ],

        reporters: ['dots', 'coverage', 'junit'],

        junitReporter: {
            outputFile: 'test/js-test-results.xml'
        },

        //coverageReporter: {
        //    reporters: [
        //        { type: 'lcov', dir: 'test/coverage/' },
        //        { type: 'cobertura', dir: 'test/coverage/' }
        //    ]
        //},

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],//['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000
    });
};