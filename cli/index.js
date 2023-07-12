"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const yargs = __importStar(require("yargs"));
const child_process_1 = require("child_process");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const argv = yargs
    .option('skipInstall', {
    type: 'boolean',
    demandOption: false,
    default: false,
    description: 'Skip npm install dependencies'
})
    .option('skipGit', {
    type: 'boolean',
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
    demandOption: false,
    default: false,
    description: 'Replace all existing files'
})
    .option('template', {
    type: 'string',
    demandOption: true,
    default: path.resolve(__dirname, '../template'),
    description: 'Template directory'
})
    .option('cwd', {
    type: 'string',
    demandOption: true,
    default: process.cwd(),
    description: 'Target directory'
})
    .parseSync();
const TEMPLATE_DIR = path.resolve(argv.template);
const CWD = path.resolve(argv.cwd) + path.sep;
(async () => {
    if (!fs.existsSync(CWD)) {
        fs.mkdirSync(CWD, { recursive: true });
    }
    copyTemplateFiles(TEMPLATE_DIR, CWD, true);
    copyTemplateFiles(TEMPLATE_DIR, CWD, false);
    await askPackageName();
    await initGit();
    await installDependencies();
    log('Finish');
    process.exit();
})();
function copyTemplateFiles(from, to, dry) {
    const files = fs.readdirSync(from, { withFileTypes: true });
    files.forEach((file) => {
        if (file.isDirectory()) {
            if (!dry && !fs.existsSync(path.resolve(to, file.name))) {
                log('Make directory: ', path.resolve(to, file.name).replace(CWD, ''));
                fs.mkdirSync(path.resolve(to, file.name), { recursive: true });
            }
            return copyTemplateFiles(path.resolve(from, file.name), path.resolve(to, file.name), dry);
        }
        const normalName = file.name.replace('t_t', '');
        const fileName = path.resolve(to, normalName);
        if (!argv.force && fs.existsSync(fileName)) {
            log('Error', `File "${fileName.replace(CWD, '')}" already exists. Use --force`);
            process.exit(0);
        }
        if (!dry) {
            log('Copy file: ', fileName.replace(CWD, ''));
            fs.copyFileSync(path.resolve(from, file.name), fileName);
        }
    });
}
function log(message, ...args) {
    console.log('\x1b[33m' + message + '\x1b[0m', ...args);
}
function askPackageName() {
    let pkgName = path.basename(CWD);
    if (argv.yes || argv.name) {
        return writePackageName(argv.name || pkgName);
    }
    return new Promise((resolve) => {
        log('Enter package name');
        readline.question(`(Press enter for [${pkgName}])?`, (name) => {
            if (!name) {
                name = pkgName;
            }
            readline.close();
            writePackageName(name);
            resolve();
        });
    });
}
function writePackageName(name) {
    log(`Package name "${name}"`);
    const packageJson = require(path.resolve(argv.cwd, 'package.json'));
    packageJson.name = name;
    fs.writeFileSync(path.resolve(argv.cwd, 'package.json'), JSON.stringify(packageJson, null, '    '));
}
function installDependencies() {
    if (argv.skipInstall) {
        log('Skip dependencies installing');
        return;
    }
    log('Install dependencies ...');
    return (0, child_process_1.spawnSync)('npm', ['install'], { stdio: 'inherit', cwd: CWD, shell: true });
}
function initGit() {
    if (argv.skipGit) {
        log('Skip git');
        return;
    }
    log('Init git ...');
    return (0, child_process_1.spawnSync)('git', ['init'], { stdio: 'inherit', cwd: CWD, shell: true });
}
