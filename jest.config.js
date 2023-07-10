const path = require('path');

module.exports = {
    verbose: true,
    preset: 'ts-jest',
    automock: false,
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy'
    },
    setupFiles: [path.resolve(__dirname, './jest.setup.ts')],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    target: 'es2018',
                    module: 'es6',
                    esModuleInterop: true
                },
                isolatedModules: true
            }
        ]
    },
    transformIgnorePatterns: ['node_modules/(?!(@mappable-world)/)']
};
