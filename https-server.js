/**
 * Created by Jonathan on 4/29/2015.
 */
var https = require('https');
var fs = require('fs');
var settings = require('./conf/settings');

var options = {
    key: fs.readFileSync(settings.sslSettings.key),
    cert: fs.readFileSync(settings.sslSettings.crt)
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8002);