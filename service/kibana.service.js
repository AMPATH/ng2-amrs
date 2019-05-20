
const kibanaConfig = require('../conf/kibana-config.json');

var serviceDefinition = {
    getKibanaDashboards: getKibanaDashboards
};

module.exports = serviceDefinition;

function getKibanaDashboards() {
    let dashboards = kibanaConfig['dashboards'];
    return new Promise(function (resolve, reject) {
        if(dashboards){
            resolve(JSON.parse(JSON.stringify(dashboards)));
        }else {
            reject('Error fetching dashboards');
        }

    });
};

