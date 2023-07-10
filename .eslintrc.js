module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2018
    },
    extends: ['prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        camelcase: [1, {properties: 'never'}],
        // Temprorarily disable therse rules because of conflict with typescript analogues
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            2,
            {
                args: 'after-used',
                argsIgnorePattern: '^_',
                ignoreRestSiblings: true,
                vars: 'all',
                varsIgnorePattern: '^_'
            }
        ],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        // https://github.com/typescript-eslint/typescript-eslint/issues/1856
        'no-use-before-define': 'off',
        // https://github.com/typescript-eslint/typescript-eslint/issues/2477#issuecomment-686892459
        'no-undef': 'off',
        'import/order': 'off',
        'comma-dangle': 'off',
        'max-params': 'off',
        'no-nested-ternary': 'off'
    }
};
