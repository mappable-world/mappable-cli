import {argv} from '../args';
import * as path from 'path';
import * as fs from 'fs';
import {marked} from 'marked';

export async function example() {
    console.log('Generate example.');
    const input = path.resolve(argv.input as string);
    const output = path.resolve(argv.output as string);

    console.log('Input:', input);
    console.log('Output:', output);

    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, {recursive: true});
    }
    if (!fs.statSync(output).isDirectory()) {
        console.log('Output is not a directory.');
        process.exit(1);
    }

    if (!fs.existsSync(input) || !fs.statSync(input).isDirectory()) {
        console.log('Input is not a directory.');
        process.exit(1);
    }

    const templateFile = path.resolve(argv.templateFile as string);

    if (!fs.existsSync(templateFile) || !fs.statSync(templateFile).isFile()) {
        console.log('Template file not found.', templateFile);
        process.exit(1);
    }

    const template = fs.readFileSync(templateFile, 'utf8');

    const readmeFile = path.resolve(argv.readmeFile as string);

    if (!fs.existsSync(readmeFile) || !fs.statSync(readmeFile).isFile()) {
        console.log('README file not found.', readmeFile);
        process.exit(1);
    }

    const readme = fs.readFileSync(readmeFile, 'utf8');

    const packageFile = path.resolve(process.cwd(), 'package.json');

    const pkg = {
        version: ''
    };

    if (fs.existsSync(packageFile) && fs.statSync(packageFile).isFile()) {
        Object.assign(pkg, JSON.parse(fs.readFileSync(packageFile, 'utf8')));
    }

    copyAndReplace(input, output, process.env);

    fs.writeFileSync(
        path.resolve(output, 'index.html'),
        template
            // prettier-ignore
            .replace(/%README%/, marked(readme))
            .replace(/%REFERENCES%/, '')
            .replace(/%VERSION%/, pkg.version ? 'v.' + pkg.version : '')
    );
}

function copyAndReplace(input: string, output: string, replace: Record<string, unknown>): void {
    fs.readdirSync(input, {withFileTypes: true}).forEach((file) => {
        if (file.isDirectory()) {
            if (!fs.existsSync(path.resolve(output, file.name))) {
                fs.mkdirSync(path.resolve(output, file.name), {recursive: true});
            }
            return copyAndReplace(path.resolve(input, file.name), path.resolve(output, file.name), replace);
        }

        const content = fs.readFileSync(path.resolve(input, file.name), 'utf8');
        const newContent = content.replace(/%(\w+)%/gi, (match, key) => {
            return replace[key.trim()] !== undefined ? replace[key.trim()].toString() : match;
        });

        fs.writeFileSync(path.resolve(output, file.name), newContent);
    });
}
