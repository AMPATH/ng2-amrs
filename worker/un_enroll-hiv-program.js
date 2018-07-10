var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , moment = require('moment')
    , curl = require('curlrequest')
    , es = require('event-stream');

var https = require('http');
var config = require('../conf/config');

var lineNr = 0;


var input_file = './un_enrollment_program.csv';
var error_file = './un_enrollment_program_failed.csv';
var enrollmentUuid = '';

fs.exists(error_file, function (exists) {
    if (exists) {
        fs.unlink(error_file, function (err) {
            if (err) throw err;
            console.log('successfully deleted ' + error_file);
        });
    }
});

function createPayload(inputLine) {
    let column = inputLine.split(',');
    let payload = {
        dateCompleted: column[1],
        uuid:column[0]
    };
    enrollmentUuid = column[0];
    return payload;
}

var s = fs.createReadStream(input_file)
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        // pause the readstream
        s.pause();

        lineNr += 1;

        try {
            if (line && line !== '') {
                console.log('unerolling incompatible program: ', line);
                var openmrsAppName = config.openmrs.applicationName || 'amrs';
                let payload = createPayload(line);
                //JSON.stringify(createPayload(line));
                var url = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + '/' + openmrsAppName + '/ws/rest/v1/programenrollment/' +
                    payload.uuid;
                delete payload['uuid'];
                payload = JSON.stringify(payload);

                var usernamePass = config.eidSyncCredentials.username + ":" + config.eidSyncCredentials.password;
                var auth = "Basic " + new Buffer(usernamePass).toString('base64');

                var options = {

                    url: url,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    },
                    method: 'POST'
                };

                curl.request(options, function (err, parts) {

                    if (err || (parts && JSON.parse(parts).error)) {
                        console.log('error updating enrollment location to a program: ' + line, err || JSON.parse(parts).error);
                        fs.appendFileSync(error_file, line + '\r\n');
                    } else {
                        console.log('updated enrollment location for program: ' + line);
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
