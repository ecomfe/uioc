var path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                include: [
                    path.resolve(__dirname, 'node_modules/uioc/dist')
                ],
                loader: 'source-map-loader'
            }
        ],
        loaders: [
            {
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0'],
                }
            }
        ]
    },
    devtool: 'source-map'
};