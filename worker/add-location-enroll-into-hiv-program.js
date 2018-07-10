var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , moment = require('moment')
    , curl = require('curlrequest')
    , es = require('event-stream');

var https = require('http');
var config = require('../conf/config');

var lineNr = 0;


var input_file = './location_enrollment.csv';
var error_file = './location_enrollment_failed.csv';
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
    let ampathHivProgram = { uuid: '781d85b0-1359-11df-a1f1-0026b9348838', name: 'HIV TREATMENT' };
    let payload = {
        location: column[1],
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
                console.log('Updating existing enrollment to have location: ', line);
                var openmrsAppName = config.openmrs.applicationName || 'amrs';
                let payload = createPayload(line);

                var protocol = config.openmrs.https ? 'https' : 'http';
                //JSON.stringify(createPayload(line));
                var url = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + '/' + openmrsAppName + '/ws/rest/v1/programenrollment/' +
                    payload.uuid;
                delete payload['uuid'];
                payload = JSON.stringify(payload);
                console.log('url===', url);

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
/*
 SELECT
 t1.patient_id,
 t1.program_id,
 t1.date_enrolled,
 t1.uuid AS program_uuid,
 t2.name AS program_name,
 t3.location_id,
 t4.uuid AS loctionUuid,
 t4.name AS locationName,
 MAX(t3.encounter_datetime) AS encounterDate
 FROM
 amrs.patient_program `t1`
 LEFT OUTER JOIN
 amrs.program `t2` ON (t1.program_id = t2.program_id)
 LEFT OUTER JOIN
 amrs.encounter `t3` ON (t1.patient_id = t3.patient_id)
 LEFT OUTER JOIN
 amrs.location `t4` ON (t3.location_id = t4.location_id)
 WHERE
 t1.date_completed IS NULL
 AND t1.location_id IS NULL
 AND t3.encounter_datetime = (select MAX(t3.encounter_datetime))
 AND t3.encounter_type IN (1,2,3,4,10,14,15,17,19,26,32,33,34,47,105,106,112,113,114,115,117,120,127,128, 129)
 GROUP BY t1.patient_id
 #limit 2000
 */
