import * as yargs from 'yargs';
import * as path from 'path';

Object.assign(process.env, require('dotenv').config());
export const argv = yargs
    .strict()
    .command(['create', '$0'], 'Create new package')
    .command('example', 'Prepare static example', (yargs) => {
        return yargs
            .option('input', {
                type: 'string',
                demandOption: true,
                default: path.resolve(process.cwd(), './example'),
                description: 'Source directory'
            })
            .option('output', {
                type: 'string',
                demandOption: true,
                default: path.resolve(process.cwd(), './dist/example'),
                description: 'Target directory'
            });
    })
    .option('skipInstall', {
        type: 'boolean',
        alias: 'si',
        demandOption: false,
        default: false,
        description: 'Skip npm install dependencies'
    })
    .option('skipGit', {
        type: 'boolean',
        alias: 'sg',
        demandOption: false,
        default: false,
        description: 'Skip git init'
    })
    .option('name', {
        type: 'string',
        demandOption: false,
        description: 'Package name'
    })
    .option('yes', {
        type: 'boolean',
        alias: 'y',
        demandOption: false,
        default: false,
        description: 'Always agree'
    })
    .option('force', {
        type: 'boolean',
        alias: 'f',
        demandOption: false,
        default: false,
        description: 'Replace all existing files'
    })
    .option('template', {
        type: 'string',
        alias: 't',
        demandOption: true,
        default: path.resolve(__dirname, '../template'),
        description: 'Template directory'
    })
    .option('out', {
        type: 'string',
        alias: 'target',
        demandOption: true,
        default: process.cwd(),
        description: 'Target directory'
    })
    .demandCommand()
    .version(require('../package').version)
    .alias('version', 'v')
    .help('help')
    .alias('help', 'h')
    .alias('help', '?')
    .example(
        'npx @mappable-world/mappable-cli create --out="./"',
        'Creates all the necessary structure of files and folders'
    )
    .example('npx @mappable-world/mappable-cli create --out="./" --name=my-super-package', 'Do not ask package name')
    .example('npx @mappable-world/mappable-cli --skipInstall', 'Do not run "npm install"')
    .example(
        'npx @mappable-world/mappable-cli example --outExample="./example"',
        'Create example folder for static hosting'
    )
    .epilogue('License: Apache-2')
    .parseSync();
