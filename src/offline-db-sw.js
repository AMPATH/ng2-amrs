//Listen for fetch here and decide where to get or store the data
importScripts('assets/pouchdb-7.0.0.min.js');
importScripts('assets/pouchdb.find.min.js')
importScripts('assets/aes-helper.js');
importScripts('https://unpkg.com/service-worker-router@1.7.2/dist/router.min.js');

const Router = self.ServiceWorkerRouter.Router
const router = new Router();

var patients_db = new PouchDB('new_patient_db');
buildPatientDBIndexes();

var remoteDB = new PouchDB('http://localhost:5984/patients');
var start = new Date().getTime();

patients_db.replicate.from(remoteDB, {live:true, retry:true}).on('complete', function () {
  console.log('yay, were done!');
  console.log(new Date().getTime() - start, 'milliseconds later');
}).on('error', function (err) {
  console.log('boo, something went wrong!');
});


patients_db.changes({
  since: 'now',
  include_docs: true,
  live: true,
  retry: true
})
.on('change', function(change) {return handleChange(change)})
.on('error', function(){ console.log(error);})



function handleChange(change){
  console.log(change, 'changes saved!');
  let changedDoc = null;
  let changedIndex = null;
}







router.get('/amrs/ws/rest/v1/patient', interceptPatientSearchRequest);
router.get('/amrs/ws/rest/v1/session',interceptAuthRequest);


self.addEventListener('fetch', (event) => {
  router.handleEvent(event);
});


///////////////////////////// Helpers /////////////////////////////
function decryptAuth(username, password) {
  var dbName = `users`
  var db = new PouchDB(dbName);
  return db.get(username).then((data) => {
    // decrypt response using the password
    let encryptedResponse = data['userdata'];
    return decrypt(password, encryptedResponse).then((decryptedResponse) => {
      // successfully authenticated
      self.console.log(decryptedResponse, 'Successful auth');
      return JSON.parse(decryptedResponse);
    }).catch((error) => {
      // authentication error
      throw new Error('Unable to decrypt response given the passphrase');
    });
  });
}

function getCredentialsFromAuthHeader(authHeader) {
  if (authHeader != null && authHeader.toLowerCase().startsWith('basic')) {
    // Authorization: Basic base64credentials
    let base64Credentials = authHeader.substring("Basic".length).trim();
    let credDecoded = atob(base64Credentials);
    // credentials = username:password
    let credArray = credDecoded.split(":", 2);
    let username = credArray[0];
    let password = credArray[1];
    let credentials =  {
      username,
      password
    };
    return credentials;
  }
    return null;
}

function getUrlQueryParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
    let [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })
  return params
}

///////////////////////////// Interceptors /////////////////////////////
function interceptAuthRequest({request, params}) {
  return fetch(request).then((response) => {
    if (!response.ok) {
      throw Error('Error occured with response status ' + response.status);
    }
    self.console.log(response, 'from service worker');
    return response;
  }).catch((error) => {
    let authHeader = request.headers.get('Authorization');
    let credentials = getCredentialsFromAuthHeader(authHeader);
    if(credentials !== null) {
      return decryptAuth(credentials.username, credentials.password)
      .then((response) => {
          return new Response(JSON.stringify(response), {
            headers: {'Content-Type': 'application/json'}, status: 200
          })
      }).catch((error) => {
          return new Response(JSON.stringify({"authenticated": false}, {
            headers: {'Content-Type': 'application/json'}, status: 401
           }));
       });
    }
  });
}

function interceptPatientSearchRequest({request, params}) {
  return fetch(request).then((response) => {
    if (!response.ok) {
      throw Error('Error occured with response status ' + response.status);
    }
    self.console.log(response, 'from service worker');
    return response;
    }).catch((error) => {
       self.console.warn('Constructing a fallback response due to an error', error);
       // perform patient search from pouch
       let url = request.url;
       let queryParams = getUrlQueryParams(url);
       self.console.log(queryParams.q, 'identifier');

       return patients_db.query('identifier_indexyz/by_identifier', {
        key: queryParams.q,
        include_docs: true
      }).then((results) => {
        console.log(results, 'Patient Search Results');
        let arr = [];
        if(results.rows) {
          for(result of results.rows){
            arr.push(result.doc.patient);
          }
        }
        let response = { results: arr };
        return new Response(JSON.stringify(response), {status: 200});
      }).catch(error => {
        console.log('Error while querying the database with an index', error);
        return new Response(JSON.stringify({}), {status: 500});
      });
});
}

function dummyInterceptor({request, params}) {
  return fetch(request).then((response) => {
    return new Response(JSON.stringify(response), {status: 200, statusText: 'OK'});
  });
}

function buildPatientDBIndexes() {
  let start = new Date().getTime();
  // design document, which describes the map function
  var ddoc = {
    _id: '_design/identifier_indexyz',
    views: {
      by_identifier: {
        map: function (doc) {
          for (let identifierObj of doc.patient.identifiers) {
            emit(identifierObj.identifier);
          }
         }.toString()
      }
    }
  };

  patients_db.put(ddoc).then(() => {
    self.console.log('Successfully saved index and map function!');
  }).catch((err) => {
    self.console.log('Unable to save index and map function!', err);
  });

  // empty query to kick off a new build
  patients_db.query('identifier_indexyz/by_identifier', {
    limit: 0
  }).then(function (res) {
    self.console.log('Successfully built patient identifier index', res);
    self.console.log('Took ' + (new Date().getTime() - start)/1000 + ' Seconds');
  }).catch(function (err) {
    self.console.log('An error occurred while building identifier index.');
  });
}