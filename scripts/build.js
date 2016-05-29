var rollup = require('rollup');
var fs = require('fs');
var uglify = require('rollup-plugin-uglify');
var babel = require('rollup-plugin-babel');

rollup.rollup({
    entry: 'src/main.js',
    plugins: [
        babel({presets: ['es2015-rollup', 'stage-0']}),
        uglify()
    ]
}).then(function (bundle) {
    bundle.write({
        sourceMap: true,
        format: 'umd',
        moduleName: 'uioc',
        dest: 'dist/bundle.js'
    });
}).catch(function (err) {
    console.log('build fail: ', err);
});