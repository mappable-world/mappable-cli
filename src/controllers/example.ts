import {argv} from '../args';
import * as path from 'path';
import * as fs from 'fs';

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

    copyAndReplace(input, output, process.env);
}

function copyAndReplace(input: string, output: string, replace: Record<string, unknown>): void {
    fs.readdirSync(input, {withFileTypes: true}).forEach((file) => {
        console.log(file.name);
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
