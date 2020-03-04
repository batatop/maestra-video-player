const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/MaestraVideoPlayer.js',
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename: 'MaestraVideoPlayer.bundle.js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs2'
    },
    externals: {
        "video.js": 'video.js',
        "react": 'react'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
}