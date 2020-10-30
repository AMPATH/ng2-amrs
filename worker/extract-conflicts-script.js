var fs = require('fs'),
  util = require('util'),
  stream = require('stream'),
  moment = require('moment'),
  es = require('event-stream');

var lineNr = 0;

var input_file = '../conflicts.txt';
var output_file = '../processed-conflicts.csv';

fs.exists(output_file, function (exists) {
  if (exists) {
    fs.unlink(output_file, function (err) {
      if (err) throw err;
      console.log('successfully deleted ' + output_file);
    });
  }
});

var s = fs
  .createReadStream(input_file)
  .pipe(es.split())
  .pipe(
    es
      .mapSync(function (line) {
        // pause the readstream
        s.pause();

        lineNr += 1;

        // if (lineNr < 20) {
        try {
          var lineArray = JSON.parse(line);
          if (Array.isArray(lineArray)) {
            for (var i = 0; i < lineArray.length; i++) {
              var conflict = lineArray[i];

              if (conflict.obs.length > 0) {
                for (var j = 0; j < conflict.obs.length; j++) {
                  var obs = conflict.obs[j];
                  var toDelete = {};
                  toDelete.dateCollected = conflict.eid.DateCollected;
                  toDelete.finalResult = conflict.eid.FinalResult;
                  toDelete.patientIdentifier = conflict.eid.PatientID;
                  toDelete.orderNo = conflict.eid.OrderNo;
                  toDelete.obsDatetime = moment(obs.obsDatetime).format(
                    'DD-MMM-YY'
                  );
                  toDelete.uuid = obs.uuid;
                  toDelete.display = obs.display;
                  toDelete.value =
                    obs.value && obs.value.uuid ? obs.value.uuid : obs.value;
                  toDelete.patientUuid = obs.person.uuid;
                  toDelete.encounterUuid =
                    obs.encounter && obs.encounter.uuid
                      ? obs.encounter.uuid
                      : '';
                  // console.log(toDelete);
                  var csvLine = '';
                  for (var o in toDelete) {
                    if (csvLine !== '') {
                      csvLine += '\t';
                    }
                    csvLine += toDelete[o];
                  }
                  csvLine += '\r\n';

                  fs.appendFileSync(output_file, csvLine);
                }
              }
            }
          }
        } catch (error) {
          console.error(error);
        }

        // }

        // console.log('reading line ', lineNr);

        // resume the readstream, possibly from a callback
        s.resume();
      })
      .on('error', function () {
        console.log('Error while reading file.');
      })
      .on('end', function () {
        console.log('Read entire file.');
      })
  );
