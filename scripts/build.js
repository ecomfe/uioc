var Builder = require('systemjs-builder');

var builder = new Builder('.');
builder.config({
    paths: {'*': '*.js'}
});
builder
    .buildStatic('src/main', 'dist/bundle.js', {minify: true, sourceMaps: true, format: 'umd'})
    .then(function () {
        console.log('Build complete');
    })
    .catch(function (err) {
        console.log('Build error');
        console.log(err);
    });
