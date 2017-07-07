const rollup = require('rollup');
const fs = require('fs');
const pkg = require('../package.json');
const uglify = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const external = Object.keys(pkg.dependencies);

rollup.rollup({
    entry: 'src/main.js',
    plugins: [
        babel({presets: ['es2015-rollup', 'stage-1']}),
        uglify()
    ],
    external: external
}).then(
    bundle => {
        bundle.write({
            dest: pkg['main'],
            format: 'umd',
            moduleName: 'uioc',
            sourceMap: true
        });
    }
).catch(err => console.log('build umd fail: ', err));
