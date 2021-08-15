const path = require('path');

module.exports = {
    entry: './src/webpack.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        library: 'CTFLang',
        filename: 'ctfl.js',
        path: path.resolve(__dirname, 'out'),
    },
};
