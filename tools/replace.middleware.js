const path = require('path');
const fs = require('fs');
const stream = require('stream');
const {marked} = require('marked');
const pkg = require(path.resolve(process.cwd(), './package.json'));

const EXT_MIME = {
    js: 'application/javascript',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg'
};

module.exports.replaceMiddleware = (dir) => (middleares, devServer) => {
    devServer.app.get('/*', (req, res, next) => {
        const file = path.join(dir, req.path);

        if (!fs.existsSync(file)) {
            next();
            return;
        }

        if (fs.statSync(file).isDirectory()) {
            res.send(
                `<html lang="en">
                   <body>
                    <ul>${fs
                        .readdirSync(file)
                        .map((p) => `<li><a href="${path.join(req.path, p)}">${p}</a></li>`)
                        .join('')}
                    </ul>
                   </body>
               </html>`
            );
            return;
        }

        const extMatch = file.match(/(?<=\.)\w+$/);
        const mime = extMatch && EXT_MIME[extMatch[0]];

        let rs = fs.createReadStream(file);
        if (/\.html?$/.test(req.path)) {
            const readmeFile = path.join(dir, 'README.md');
            const readme = fs.existsSync(readmeFile) ? fs.readFileSync(readmeFile, 'utf-8') : '';

            rs = rs.pipe(
                new stream.Transform({
                    transform(chunk, encoding, next) {
                        this.push(
                            chunk
                                .toString()
                                .replace(/%README%/g, marked(readme))
                                .replace(/%REFERENCES%/g, '')
                                .replace(/%APIKEY%/g, process.env.APIKEY)
                                .replace(/%VERSION%/, pkg.version ? 'v.' + pkg.version : '')
                        );
                        next();
                    }
                })
            );
        }
        rs.pipe(res);

        mime && res.set({'Content-Type': mime});
    });

    return middleares;
};
