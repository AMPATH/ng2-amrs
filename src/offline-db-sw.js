//Listen for fetch here and decide where to get or store the data
importScripts('assets/pouchdb-7.0.0.min.js');
importScripts('assets/pouchdb.find.min.js')
importScripts('assets/aes-helper.js');
importScripts('https://unpkg.com/service-worker-router@1.7.2/dist/router.min.js')
// self.addEventListener('activate', function(event) {
//   // Claim any clients immediately, so that the page will be under SW control without reloading.
//   event.waitUntil(self.clients.claim());
// });

function interceptPatientSearchRequest({request, params}) {
  return fetch(request).then((response) => {
    if (!response.ok) {
      throw Error('Error occured with response status ' + response.status);
    }
    self.console.log(response, 'from service worker');
    return response;
  }).catch((error) => {
    self.console.warn('Constructing a fallback response, ' +
    'due to an error while fetching the real response:', error);
    // For demo purposes, return dummy response as fallback.
    var fallbackResponse = {"results":[
      {"uuid":"ea8a4690-ace3-4421-9e04-64f79b464622","display":"423743087-3 - test mama4 test","identifiers":[{"identifier":"423743087-3","uuid":"6c3d11ba-e4f1-4b1e-a3e3-b318ef6a7998","preferred":true,"location":{"uuid":"18c343eb-b353-462a-9139-b16606e6b6c2","name":"Location Test"},"identifierType":{"uuid":"58a4732e-1359-11df-a1f1-0026b9348838","name":"AMRS Universal ID","format":"","formatDescription":"","validator":"org.openmrs.patient.impl.LuhnIdentifierValidator"}},{"identifier":"565898598","uuid":"09e1c99c-ead2-4146-92aa-0892a24e3116","preferred":false,"location":{"uuid":"18c343eb-b353-462a-9139-b16606e6b6c2","name":"Location Test"},"identifierType":{"uuid":"58a47054-1359-11df-a1f1-0026b9348838","name":"KENYAN NATIONAL ID NUMBER","format":"","formatDescription":"","validator":null}}],"person":{"uuid":"ea8a4690-ace3-4421-9e04-64f79b464622","display":"test mama4 test","gender":"M","birthdate":"2016-01-04T00:00:00.000+0300","dead":false,"age":3,"deathDate":null,"birthdateEstimated":true,"causeOfDeath":null,"preferredName":{"uuid":"10cb4b41-aaaf-42c3-a120-8d4a1f5f8308","preferred":true,"givenName":"test","middleName":"mama4","familyName":"test"},"attributes":[{"display":"Health Center = 3","uuid":"835d4b67-e96c-40b4-911c-b9b942043cc6","value":{"uuid":"08feb2dc-1352-11df-a1f1-0026b9348838","display":"Turbo","links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/08feb2dc-1352-11df-a1f1-0026b9348838"}]},"attributeType":{"uuid":"8d87236c-c2cc-11de-8d13-0010c6dffd0f","display":"Health Center","links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/personattributetype/8d87236c-c2cc-11de-8d13-0010c6dffd0f"}]},"voided":false,"links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/ea8a4690-ace3-4421-9e04-64f79b464622/attribute/835d4b67-e96c-40b4-911c-b9b942043cc6"},{"rel":"full","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/ea8a4690-ace3-4421-9e04-64f79b464622/attribute/835d4b67-e96c-40b4-911c-b9b942043cc6?v=full"}],"resourceVersion":"1.8"},{"display":"Test or Fake Patient = true","uuid":"697b028f-8aaf-4db4-898d-623e3f8d4447","value":true,"attributeType":{"uuid":"1e38f1ca-4257-4a03-ad5d-f4d972074e69","display":"Test or Fake Patient","links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/personattributetype/1e38f1ca-4257-4a03-ad5d-f4d972074e69"}]},"voided":false,"links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/ea8a4690-ace3-4421-9e04-64f79b464622/attribute/697b028f-8aaf-4db4-898d-623e3f8d4447"},{"rel":"full","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/ea8a4690-ace3-4421-9e04-64f79b464622/attribute/697b028f-8aaf-4db4-898d-623e3f8d4447?v=full"}],"resourceVersion":"1.8"},{"display":"Health Center 2 = 3","uuid":"7b11503a-1637-4bfa-844a-497a4222ae0d","value":{"uuid":"08feb2dc-1352-11df-a1f1-0026b9348838","display":"Turbo","links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/08feb2dc-1352-11df-a1f1-0026b9348838"}]},"attributeType":{"uuid":"7ef225db-94db-4e40-9dd8-fb121d9dc370","display":"Health Center 2","links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/personattributetype/7ef225db-94db-4e40-9dd8-fb121d9dc370"}]},"voided":false,"links":[{"rel":"self","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/ea8a4690-ace3-4421-9e04-64f79b464622/attribute/7b11503a-1637-4bfa-844a-497a4222ae0d"},{"rel":"full","uri":"https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/ea8a4690-ace3-4421-9e04-64f79b464622/attribute/7b11503a-1637-4bfa-844a-497a4222ae0d?v=full"}],"resourceVersion":"1.8"}],"preferredAddress":{"uuid":"b7c71bdf-3df3-47f9-b1cf-79c2ef46e271","preferred":true,"address1":null,"address2":null,"cityVillage":null,"longitude":"0°31'0.00\" N 35°16'59.88\" E78.05","stateProvince":null,"latitude":"0.516667 35.2833","country":null,"postalCode":null,"countyDistrict":null,"address3":null,"address4":null,"address5":null,"address6":null}}}
    ]
  }

  return new Response(JSON.stringify(fallbackResponse), {
    headers: {'Content-Type': 'application/json'}, status: 200
   });
 });
}


function interceptAuthRequest({request, params}) {
  return fetch(request).then((response) => {
    
    if (!response.ok) {
      throw Error('Error occured with response status ' + response.status);
    }
    self.console.log(response, 'from service worker');
    return response;
  })
  .catch((error) => {
    let authHeader = request.headers.get('Authorization');
    let credentials = getCredentials(authHeader);
    self.console.log(credentials, 'creds');
    //return new Response(JSON.stringify({authenticated: true}), {status: 200});
    if(credentials !== null) {
      return decryptAuth(credentials.username, credentials.password)
      .then((response) => new Response(JSON.stringify(response), {
        headers: {'Content-Type': 'application/json'}, status: 200
       })).catch((error) => {
          return new Response(JSON.stringify({"authenticated": false}, {
            headers: {'Content-Type': 'application/json'}, status: 401
           }));
       });
    }
  });
}

const Router = self.ServiceWorkerRouter.Router
const router = new Router();

router.get('/amrs/ws/rest/v1/patient', interceptPatientSearchRequest);
router.get('/amrs/ws/rest/v1/session', interceptAuthRequest);


self.addEventListener('fetch', (event) => {
  router.handleEvent(event);
});



function getUrlParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&');
  let params = {};
  hashes.map(hash => {
    let [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
}

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

function getCredentials(authHeader) {
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