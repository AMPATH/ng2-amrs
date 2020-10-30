var Service = require('node-linux').Service;

// Create a new service object
var svc = new Service({
  name: 'Etl Server',
  script: require('path').join('/home/werick/etl-rest-server/etl-server.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});
// Uninstall the service.
svc.uninstall();
