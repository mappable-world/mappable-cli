const path = require('path');
const fs = require('fs');
const stream = require('stream');

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
        const file = path.join(dir, req.url);

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

        const extMatch = pathname.match(/(?<=\.)\w+$/);
        const mime = (extMatch && EXT_MIME[extMatch[0]]);

        let rs = fs.createReadStream(file);
        if (/\.html?$/.test(req.url)) {
            rs = rs.pipe(
                new stream.Transform({
                    transform(chunk, encoding, next) {
                        this.push(chunk.toString().replace(/%APIKEY%/g, process.env.APIKEY));
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
