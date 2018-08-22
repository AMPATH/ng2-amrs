//Listen for fetch here and decide where to get or store the data
importScripts('assets/pouchdb-7.0.0.min.js')
importScripts('assets/pouchdb.find.min.js')
self.addEventListener('fetch', (event) => {
  let url = new URL(event.request.url)
  let path = url.pathname;
  let searchParams = getUrlParams(url.search);

  if (path === '/amrs/ws/rest/v1/patient') {
    event.respondWith(
      fetch(event.request).then((response) => {
        self.console.log(response);
        return response;
      }).catch(function (error) {
        let search = getUrlParams(url.search);
        var db = new PouchDB('location1');
        db.createIndex({
          index: {
            fields: ['type']
          }
        });
        let results = db.find({
          selector: {
            type: {
              "$eq": "Patients"
            }
          },
          sort: ['_id']
        })
        return results.then((docs) => {
          let result = docs.docs[0];
          let results = docs.docs[0].results;
          let filteredResults = results.filter((element) =>
            element.identifiers.some((subElement) => subElement.identifier === search.q));
          return new Response(JSON.stringify({
            results: filteredResults
          }));
        })
      })
    );
  }
});

function getUrlParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
    let [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })
  return params
}
