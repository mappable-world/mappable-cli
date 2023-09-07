const path = require('path');
const fs = require('fs');
const {replaceMiddleware} = require('./tools/replace.middleware');
const isProduction = process.env.NODE_ENV === 'production';

Object.assign(process.env, require('dotenv').config());

if (!process.env.APIKEY) {
    throw new Error('Define APIKEY env');
}

module.exports = (args, env, dir = process.cwd()) => {
    const {name} = require(path.resolve(dir, './package.json'));

    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            index: {
                import: './src/index.ts',
                library: {
                    name,
                    type: 'global'
                }
            },
            'index.umd': {
                import: './src/index.ts',
                library: {
                    name,
                    type: 'umd'
                }
            }
        },
        output: {
            clean: true,
            publicPath: '/dist/',
            path: path.resolve(dir, 'dist')
        },
        devServer: {
            hot: true,
            setupMiddlewares: replaceMiddleware(dir),
            client: {
                overlay: true,
                progress: true
            },
            open: fs.existsSync(path.resolve(dir, 'example')) ? 'example' : true,
            host: process.env.LOCALHOST || 'localhost'
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/i,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            declaration: true,
                            declarationDir: 'dist/types'
                        },
                        onlyCompileBundledFiles: true
                    },
                    exclude: ['/node_modules/']
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: 'asset'
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
        }
    };
};
