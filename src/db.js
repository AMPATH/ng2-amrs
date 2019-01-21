function initPatientsDB() {
  patient_db = new PouchDB('patients');

  // design document, which describes the map function
  var ddoc = {
    _id: '_design/identifier_index',
    views: {
      by_identifier: {
        map: function (doc) { 
          for (let identifierObj of doc.identifiers) {
            emit(identifierObj.identifier);
          }
         }.toString()
      }
    }
  };

  patient_db.put(ddoc).then(() => {
    self.console.log('Successfully saved index and map function!');
  }).catch((err) => {
    self.console.log('Unable to save index and map function!',err);
  });

  // empty query to kick off a new build
  patient_db.query('identifier_index/by_identifier', {
    limit: 0 // don't return any results
  }).then(function (res) {
    // index was built!
    self.console.log('Successfully built patient identifier index', res);
  }).catch(function (err) {
    // some error
    self.console.log('An error occurred while building identifier index.');
  });
}