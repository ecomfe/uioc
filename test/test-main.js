var TEST_REGEXP = /(test\/spec)/i;
var allTestFiles = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace('/base/test/', '').replace('.js', '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/test/assets',

    packages: [
        {
            name: 'ioc',
            location: '../../src'
        },
        {
            name: 'spec',
            location: '../spec'
        },
        {
            name: 'uaop',
            location: '../../node_modules/uaop/src'
        }
    ],
    paths: {
        jquery: 'https://code.jquery.com/jquery-1.12.4.min'
    }
});

define.amd.jQuery = true;
require(allTestFiles, window.__karma__.start);