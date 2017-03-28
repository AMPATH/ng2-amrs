import { Injectable } from '@angular/core';

@Injectable()
export class RoutesProviderService {
    public analyticsDashboardConfig: Object = require('./schema/analytics.dashboard.conf.json');
    public clinicDashboardConfig: Object = require('./schema/clinic.dashboard.conf.json');
    public patientDashboardConfig: Object = require('./schema/patient.dashboard.conf.json');

    constructor() { }
}
