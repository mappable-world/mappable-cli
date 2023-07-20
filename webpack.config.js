const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

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
            }
        },
        output: {
            clean: true,
            path: path.resolve(dir, 'dist')
        },
        devServer: {
            static: {
                directory: path.join(dir, './example'),
            },
            open: true,
            host: 'localhost'
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/i,
                    loader: 'ts-loader',
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
}
