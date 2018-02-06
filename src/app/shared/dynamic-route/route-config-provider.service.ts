import { Injectable } from '@angular/core';

@Injectable()
export class RoutesProviderService {
    public analyticsDashboardConfig: object = require('./schema/analytics.dashboard.conf.json');
    public clinicDashboardConfig: object = require('./schema/clinic.dashboard.conf.json');
    public patientDashboardConfig: object = require('./schema/patient.dashboard.conf.json');
    public patientListCohortConfig: object = require('./schema/patientlist.dashboard.conf.json');
    public providerDashboardConfig: object = require('./schema/provider.dashboard.conf.json');
    constructor() { }
}
