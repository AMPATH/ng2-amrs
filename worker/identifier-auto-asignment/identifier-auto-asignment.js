const fs = require('fs');
const csv = require('@fast-csv/parse');

const curl = require('curlrequest');
const config = require('../../conf/config.json');
const e = require('express');

const stream = fs.createReadStream(__dirname + '/cccids.csv');

const error_file = __dirname + '/ccc-errors.csv';

fs.exists(error_file, function (exists) {
  if (exists) {
    fs.unlink(error_file, function (err) {
      if (err) throw err;
      console.log('successfully deleted ' + error_file);
    });
  }
});

csv
  .parseStream(stream)
  .on('error', (error) => console.error(error))
  .on('data', (row) => {
    stream.pause();

    checkIfIdentifierExists(row[1]).then((d) => {
      if (d == false) {
        postIdentifier(row).then((d) => {
          if (d.error) {
            fs.appendFileSync(error_file, d.error.message + '\r\n');
          }
          stream.resume();
        });
      } else if (d.identifier != row[0]) {
        updateIdentifier(row, d.uuid)
          .then((d) => {
            if (d.error) {
              fs.appendFileSync(error_file, d.error.message + '\r\n');
            }
            stream.resume();
          })
          .catch((err) => {
            console.log('err', err);
          });
      } else {
        stream.resume();
      }
    });
  })
  .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));

function checkIfIdentifierExists(patientUuid) {
  const config = setupAmrs(patientUuid);

  var options = {
    url: config.url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: config.auth
    },
    method: 'GET'
  };
  return new Promise(function (resolve, reject) {
    curl.request(options, function (err, data) {
      const res = JSON.parse(data);
      res.results.forEach((identifier) => {
        if (
          identifier.identifierType.uuid ==
          'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'
        ) {
          resolve(identifier);
        } else {
          resolve(false);
        }
      });
    });
  });
}

function updateIdentifier(patientId, uuid) {
  const payload = JSON.stringify(createPayload(patientId));
  const config = setupAmrs(patientId[1]);

  const url = config.url + '/' + uuid;

  var options = {
    url: url,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: config.auth
    },
    method: 'POST'
  };
  return new Promise(function (resolve, reject) {
    try {
      curl.request(options, function (err, data) {
        resolve(JSON.parse(data));
      });
    } catch (e) {
      console.log('err ', e);
      reject(e);
    }
  });
}

function postIdentifier(patientId) {
  const payload = JSON.stringify(createPayload(patientId));
  const config = setupAmrs(patientId[1]);

  console.log(config.url);

  var options = {
    url: config.url,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: config.auth
    },
    method: 'POST'
  };
  return new Promise(function (resolve, reject) {
    try {
      curl.request(options, function (err, data) {
        resolve(JSON.parse(data));
      });
    } catch (e) {
      console.log('err ', e);
      reject(e);
    }
  });
}

function setupAmrs(uuid) {
  var url =
    'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/' + uuid + '/identifier';

  var usernamePass =
    'username:password'; /* REPLACE WITH AMRS USERNAME AND PASSWORD HERE */
  var auth = 'Basic ' + new Buffer(usernamePass).toString('base64');

  return { url: url, auth: auth };
}

function createPayload(csvData) {
  return {
    identifier: csvData[0],
    identifierType: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e',
    location: '08fec33a-1352-11df-a1f1-0026b9348838',
    preferred: true
  };
}
