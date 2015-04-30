/**
 * Created by Jonathan on 4/29/2015.
 */
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('conf/etl-key.pem'),
    cert: fs.readFileSync('conf/etl-cert.pem')
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8002);