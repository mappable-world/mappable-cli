import * as path from 'path';
import * as fs from 'fs';
import {spawnSync} from 'child_process';
import {argv} from './args';

type Macros = {[key in string]: string | number};

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const TEMPLATE_DIR = path.resolve(argv.template);
const TARGET = path.resolve(argv.out) + path.sep;

(async () => {
    if (!fs.existsSync(TARGET)) {
        fs.mkdirSync(TARGET, {recursive: true});
    }

    const packageName = await askPackageName();

    const macros: Macros = {
        YEAR: new Date().getFullYear(),
        UTILS_VERSION: require('../package.json').version,
        PACKAGE_VERSION: '0.0.1-beta.1',
        PACKAGE_NAME: packageName
    };

    copyTemplateFiles(TEMPLATE_DIR, TARGET, true, macros);
    copyTemplateFiles(TEMPLATE_DIR, TARGET, false, macros);

    await initGit();
    await installDependencies();

    log('Finish. Run: npm start');
    process.exit();
})();

function copyTemplateFiles(from: string, to: string, dry: boolean, macros: Macros): void {
    const files = fs.readdirSync(from, {withFileTypes: true});

    files.forEach((file) => {
        if (file.isDirectory()) {
            if (!dry && !fs.existsSync(path.resolve(to, file.name))) {
                log('Make directory: ', path.resolve(to, file.name).replace(TARGET, ''));
                fs.mkdirSync(path.resolve(to, file.name), {recursive: true});
            }

            return copyTemplateFiles(path.resolve(from, file.name), path.resolve(to, file.name), dry, macros);
        }

        const normalName = file.name.replace('t_t', '');
        const fileName = path.resolve(to, normalName);

        if (!argv.force && fs.existsSync(fileName)) {
            log('Error', `File "${fileName.replace(TARGET, '')}" already exists. Use --force`);
            process.exit(0);
        }

        if (!dry) {
            log('Copy file: ', fileName.replace(TARGET, ''));
            fs.copyFileSync(path.resolve(from, file.name), fileName);
            replaceMacros(fileName, macros);
        }
    });
}

function log(message: string, ...args: unknown[]): void {
    console.log('\x1b[33m' + message + '\x1b[0m', ...args);
}

function askPackageName(): Promise<string> {
    let pkgName = path.basename(TARGET);

    if (argv.yes || argv.name) {
        return Promise.resolve(argv.name || pkgName);
    }

    return new Promise<string>((resolve) => {
        log('Enter package name');
        readline.question(`(Press enter for "${pkgName}")? `, (name: string) => {
            if (!name) {
                name = pkgName;
            }
            readline.close();

            resolve(name);
        });
    });
}

function replaceMacros(filePath: string, macros: Macros): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    log(`Replace macros:`, path.basename(filePath));
    fs.writeFileSync(
        filePath,
        Object.entries(macros).reduce((cnt, [key, value]) => {
            const re = RegExp(`%${key}%`, 'g');
            return cnt.replace(re, value.toString());
        }, content)
    );
}

function installDependencies() {
    if (argv.skipInstall) {
        log('Skip dependencies installing');
        return;
    }

    log('Install dependencies ...');
    return spawnSync('npm', ['install'], {stdio: 'inherit', cwd: TARGET, shell: true});
}

function initGit() {
    if (argv.skipGit) {
        log('Skip git');
        return;
    }

    log('Init git ...');
    return spawnSync('git', ['init'], {stdio: 'inherit', cwd: TARGET, shell: true});
}
