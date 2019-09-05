import { SurgeService } from '../../service/surge-reports/surge-report.service';

const authorizer = require('../../authorization/etl-authorizer');
const privileges = authorizer.getAllPrivileges();
const routes = [

]
exports.routes = server => server.route(routes);