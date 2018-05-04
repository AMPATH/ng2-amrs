import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DynamicRouteModel } from './dynamic-route.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { DashboardModel } from './dashboard.model';
import { RouteModel } from './route.model';
@Injectable()
export class DynamicRoutesService {
  public routes = new ReplaySubject(1);
  public patientRoutes = new ReplaySubject<Array<RouteModel>>(1);
  public routesModel = {};
  public dashboardConfig: DashboardModel = null;
  public analyticsDashboardConfig: object = require('./schema/analytics.dashboard.conf.json');
  public clinicDashboardConfig: object = require('./schema/clinic.dashboard.conf.json');
  public patientDashboardConfig: object = require('./schema/patient.dashboard.conf.json');
  public patientListCohortConfig: object = require('./schema/patientlist.dashboard.conf.json');
  public providerDashboardConfig: object = require('./schema/provider.dashboard.conf.json');

  constructor() {
    this.dashboardConfig = {
      analyticsDashboard: this.analyticsDashboardConfig,
      clinicDashboard: this.clinicDashboardConfig,
      patientDashboard: this.patientDashboardConfig,
      patientListCohorts: this.patientListCohortConfig,
      providerDashboard: this.providerDashboardConfig
    };
  }

  public resetRoutes() {
    Object.assign(this.routesModel, {
      dashboardId: '',
      programs: [],
      moduleLabel: '',
      params: {},
      routes: []
    });
    this.routes.next(this.routesModel);
    this.patientRoutes.next(new Array<RouteModel>());
  }

  public setRoutes(route: DynamicRouteModel) {
    if (this.dashboardConfig) {
      let routes: Array<object> = this.extractRoutes(route, this.dashboardConfig);
      route.routes = routes;
      Object.assign(this.routesModel, route);
      this.routes.next(this.routesModel);
    }
  }

  public setPatientDashBoardRoutes(pRoutes: Array<RouteModel>) {
    this.patientRoutes.next(pRoutes);
  }

  public extractRoutes(route: DynamicRouteModel, dashboardConfig: object): Array<object> {
    let dashboard: object = dashboardConfig[route.dashboardId];
    let routes: Array<object> = [];
    let routeParameter: string;
    // extract routes that is common to all programs
    dashboard['nonProgramRoutes'].forEach((nonProgramRoute: object) => {
      let url = dashboard['baseRoute'] +
        this.extractParameter(dashboard['routeParameter'], route)
        + '/' + nonProgramRoute['url'];
      routes.push(
        {
          url: url,
          label: nonProgramRoute['label'],
          icon: nonProgramRoute['icon'],
          menuStartLetter: this.getMenuStartLetter(nonProgramRoute['label']),
          isSideBarOpen: nonProgramRoute['isSideBarOpen'],
          onClick: this.hideSidebar
        }
      );
    });

    // extract routes that is program specific
    dashboard['programs'].forEach((program: Array<object>) => {
      route.programs.forEach((enrolledProgram: ProgramEnrollment) => {
        if (enrolledProgram.program.uuid === program['programUuid']) {
          program['routes'].forEach((programRoute: object) => {
            let url = dashboard['baseRoute'] +
              this.extractParameter(dashboard['routeParameter'], route)
              + '/' + programRoute['url'];
            let singleRoute = {
              url,
              label: programRoute['label'],
              icon: programRoute['icon'],
              menuStartLetter: this.getMenuStartLetter(programRoute['label']),
              isSideBarOpen: programRoute['isSideBarOpen'],
              onClick: this.hideSidebar
            };
            let index = routes.findIndex((x) => x['url'] === url);
            if (index === -1) {
              routes.push(singleRoute);
            }
          });
        }
      });
    });
    return routes;
  }

  public getMenuStartLetter(label: string) {
    label = label.trim();
    return label === 'Lab Orders' ? 'O' : label.substring(0, 1);
  }

  public hideSidebar($event) {

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('sidebar-collapse');
    body.classList.remove('sidebar-open');
    body.classList.add('sidebar-collapse');
  }

  public extractParameter(routeParameterKey: string, route: DynamicRouteModel): string {
    if (routeParameterKey) {
      return '/' + route.params[routeParameterKey];
    } else {
      return '';
    }
  }
}
