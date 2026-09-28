const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { version } = require('./package.json');

module.exports = (env) => ({
    mode: env?.development ? 'development' : 'production',
    entry: {
        worker: `${__dirname}/src/worker/index.ts`,
        popup: `${__dirname}/src/popup/index.tsx`,
    },
    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    devtool: env?.development ? 'cheap-module-source-map' : false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                removeViewBox: false,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|otf|eot)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        plugins: [
            new TsconfigPathsPlugin({
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            }),
        ],
        alias: {
            react: path.resolve('./node_modules/react'),
        },
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/manifest.json',
                    to: 'manifest.json',
                    force: true,
                },
                {
                    from: './src/popup/popup.html',
                    force: true,
                },
                {
                    context: './src/assets/icons',
                    from: '*.png',
                    to: 'icons',
                    force: true,
                },
                {
                    from: './src/_locales',
                    to: '_locales',
                    force: true,
                },
            ],
        }),
        new ZipPlugin({
            path: path.resolve(__dirname, 'release'),
            filename: `build-chrome-${version}.zip`,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
});
