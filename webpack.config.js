var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/MaestraVideoPlayer.jsx',
    output: {
        path: path.resolve('lib'),
        filename: 'MaestraVideoPlayer.jsx',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
}