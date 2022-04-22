'use strict';
const https = require('https');
const http = require('http');
const fs = require('fs');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

//Redirection to https for users trying to connect with http
const httpsRedirect = (req,res) => {
    res.writeHead(301, { 'Location': `https://localhost:8200${req.url}` });
    res.end();
}

module.exports = (app, httpsPort, httpPort) => {
    https.createServer(options, app).listen(8200);
    http.createServer(httpsRedirect).listen(httpPort);
};