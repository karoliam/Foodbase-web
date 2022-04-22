'use strict';
require('dotenv').config();

module.exports = (app, port) => {
    app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
// https://github.com/aerwin/https-redirect-demo/blob/master/server.js
    app.use ((req, res, next) => {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // if express app run under proxy with sub path URL
            // e.g. http://www.myserver.com/app/
            // then, in your .env, set PROXY_PASS=/app
            // Adapt to your proxy settings!
            const proxypath = process.env.PROXY_PASS || ''
            // request was via http, so redirect to https
            res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
        }
    });

    app.listen(port);
}