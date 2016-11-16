import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DynamicRouteModel } from './dynamic-route.model';
import { Http } from '@angular/http';
@Injectable()
export class DynamicRoutesService {
  public routes = new ReplaySubject(1);
  public routesModel = {};
  public dashboardConfig: Object = require('./schema/dashboard.conf.json');

  constructor() {
  }


  public clearRoutes(route: DynamicRouteModel) {
    Object.assign(this.routesModel, route);
    this.routes.next(this.routesModel);
  }

  public setRoutes(route: DynamicRouteModel) {
    let routes: Array<Object> = this.extractRoutes(route, this.dashboardConfig);
    route.routes = routes;
    Object.assign(this.routesModel, route);
    this.routes.next(this.routesModel);
  }

  public extractRoutes(route: DynamicRouteModel, dashboardConfig: Object): Array<Object> {
    let dashboard: Object = dashboardConfig[route.dashboardId];
    let routes: Array<Object> = [];
    let routeParameter: string;

    // extract routes that is common to all programs
    dashboard['nonProgramRoutes'].forEach((nonProgramRoute: Object) => {
      let url = dashboard['baseRoute'] +
        this.extractParameter(dashboard['routeParameter'], route)
        + '/' + nonProgramRoute['url'];
      routes.push(
        {
          url: url,
          label: nonProgramRoute['label'],
          icon: nonProgramRoute['icon'],
          isSideBarOpen: nonProgramRoute['isSideBarOpen']
        }
      );
    });

    // extract routes that is program specific
    dashboard['programs'].forEach((program: Array<Object>) => {
      route.programUuids.forEach((programUuid: string) => {
        if (programUuid === program['programUuid']) {
          program['routes'].forEach((programRoute: Object) => {
            let url = dashboard['baseRoute'] +
              this.extractParameter(dashboard['routeParameter'], route)
              + '/' + programRoute['url'];
            routes.push(
              {
                url: url,
                label: programRoute['label'],
                icon: programRoute['icon'],
                isSideBarOpen: programRoute['isSideBarOpen']
              }
            );
          });
        }
      });
    });
    return routes;
  }

  public extractParameter(routeParameterKey: string, route: DynamicRouteModel): string {
    if (routeParameterKey) {
      return '/' + route.params[routeParameterKey];
    } else {
      return '';
    }
  }
}
