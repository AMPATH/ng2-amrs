var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , moment = require('moment')
    , curl = require('curlrequest')
    , es = require('event-stream');

var https = require('http');
var config = require('../conf/config');

var lineNr = 0;

var input_file = './obs-uuid.csv';
var error_file = './not-voided.csv';

fs.exists(error_file, function (exists) {
    if (exists) {
        fs.unlink(error_file, function (err) {
            if (err) throw err;
            console.log('successfully deleted ' + error_file);
        });
    }
});

var s = fs.createReadStream(input_file)
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        // pause the readstream
        s.pause();

        lineNr += 1;

        try {
            if (line && line !== '') {
                console.log('voiding obs: ', line);
                var openmrsAppName = config.openmrs.applicationName || 'amrs';
                var url = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + '/' + openmrsAppName + '/ws/rest/v1/obs/' + line + '?!purge';

                var usernamePass = config.eidSyncCredentials.username + ":" + config.eidSyncCredentials.password;
                var auth = "Basic " + new Buffer(usernamePass).toString('base64');

                var options = {
                    url: url,
                    headers: {
                        'Authorization': auth
                    },
                    method: 'DELETE'
                };

                curl.request(options, function (err, parts) {

                    if (err || (parts && JSON.parse(parts).error)) {
                        console.log('error voiding: ' + line, err || JSON.parse(parts).error);
                        fs.appendFileSync(error_file, line + '\r\n');
                    } else {
                        console.log('voided: ' + line);
                    }

                    // resume the readstream, possibly from a callback
                    s.resume();

                });
            }



        } catch (error) {
            console.error(error);
            // resume the readstream, possibly from a callback
            s.resume();
        }
    })
        .on('error', function () {
            console.log('Error while reading file.');
        })
        .on('end', function () {
            console.log('Read entire file.')
        })
    );
