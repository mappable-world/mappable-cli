const path = require('path');
const fs = require('fs');
const stream = require('stream');

module.exports.replaceMiddleware = (middleares, devServer) => {
    devServer.app.get('/*', (req, res) => {
        const file = path.join(dir, req.url);

        if (!fs.existsSync(file)) {
            res.sendStatus(404);
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
    });

    return middleares;
};
