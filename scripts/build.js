const rollup = require('rollup');
const fs = require('fs');
const uglify = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');

rollup.rollup({
    entry: 'src/main.js',
    plugins: [
        babel({presets: ['es2015-rollup', 'stage-0']}),
        uglify()
    ]
}).then(
    bundle => bundle.write({
        sourceMap: true,
        format: 'umd',
        moduleName: 'uioc',
        dest: 'dist/bundle.js'
    })
).catch(err => console.log('build fail: ', err));