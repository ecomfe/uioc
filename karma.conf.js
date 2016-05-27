// Karma configuration
// Generated on Tue Jun 03 2014 23:30:03 GMT+0800 (CST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'test/assets/esl.js',
            'test/test-main.js',
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/**/*.js', included: false},
            {pattern: 'node_modules/uaop/dist/bundle.js', included: false},
            {pattern: 'node_modules/uaop/src/*.js', included: false},
            {pattern: 'node_modules/uaop/dist/bundle.js.map', included: false}
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/spec/**/*.js': ['babel', 'sourcemap'],
            'test/assets/aop/*.js': ['babel', 'sourcemap'],
            'src/**/*.js': process.env.TRAVIS ? ['babel', 'sourcemap', 'coverage'] : ['babel', 'sourcemap'],
            'node_modules/uaop/src/*.js': ['babel', 'sourcemap']
        },

        babelPreprocessor: {
            options: {
                presets: ['es2015', 'stage-0'],
                sourceMap: 'inline',
                plugins: ["transform-es2015-modules-umd"]
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'test/coverage/'
        },

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
        browsers: process.env.TRAVIS ? ['Chrome_travis_ci', 'PhantomJS'] : ['Chrome'],

        customLaunchers: {
            Edge: {
                base: 'IE',
                'x-ua-compatible': 'IE=edge'
            },
            IE10: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE10'
            },
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            },
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
