var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , moment = require('moment')
    , curl = require('curlrequest')
    , es = require('event-stream');

var https = require('http');
var config = require('../conf/config');

var lineNr = 0;

var input_file = './patients_not_enrolled.csv';
var error_file = './patient_enrollment_failed.csv';

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
    let ampathHivProgram = { uuid: '781d85b0-1359-11df-a1f1-0026b9348838', name: 'HIV TREATMENT' };
    let payload = {
        program: ampathHivProgram.uuid,
        patient: column[0],
        dateEnrolled: column[1]
    }
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
                console.log('Enrolling a patient into HIV Care Program: ', line);
                var openmrsAppName = config.openmrs.applicationName || 'amrs';
                let payload = JSON.stringify(createPayload(line));
                var protocol = config.openmrs.https ? 'https' : 'http';
                var url = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + '/' + openmrsAppName + '/ws/rest/v1/programenrollment/';

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
                        console.log('error enrolling a patient into program: ' + line, err || JSON.parse(parts).error);
                        fs.appendFileSync(error_file, line + '\r\n');
                    } else {
                        console.log('Enrolled Patient Into HIV Treatment: ' + line);
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
