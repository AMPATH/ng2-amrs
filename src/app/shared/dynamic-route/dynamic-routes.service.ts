import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DynamicRouteModel } from './dynamic-route.model';
import { Http } from '@angular/http';
@Injectable()
export class DynamicRoutesService {
  public routes = new ReplaySubject(1);
  public routesModel = {};
  public dashboardConfig = new ReplaySubject(1);

  constructor(private http: Http) {
    this.fetchRoutesFromFile();
  }

  public fetchRoutesFromFile(forceRefresh?: boolean) {
    if (!this.dashboardConfig.observers.length || forceRefresh) {
      this.http.get('dashboard.conf.json')
        .map((res) => res.json())
        .subscribe(
          data => this.dashboardConfig.next(data),
          err => console.log(err),
          () => console.log('Completed')
        );
    }

    return this.dashboardConfig;
  }

  public setRoutes(route: DynamicRouteModel) {
    this.fetchRoutesFromFile().subscribe(
      data => {
        let routes: Array<Object> = this.extractRoutes(route, data);
        route.routes = routes;
        Object.assign(this.routesModel, route);
        this.routes.next(this.routesModel);
      },
      err => {
        console.log(err);
      }
    );
  }

  public extractRoutes(route: DynamicRouteModel, dashboardConfig: Object): Array<Object> {
    let dashboard: Object = dashboardConfig[route.dashboardId];
    let routes: Array<Object> = [];
    let routeParameter: string;

    // extract routes that is common to all programs
    dashboard['commonRoutes'].forEach((commonRoute: Object) => {
      let url = dashboard['baseRoute'] +
        this.extractParameter(dashboard['routeParameter'], route)
        + '/' + commonRoute['url'];
      routes.push(
        {
          url: url,
          label: commonRoute['label'],
          icon: commonRoute['icon'],
          isSideBarOpen: commonRoute['isSideBarOpen'],
          isMobile: commonRoute['isMobile']
        }
      );
    });

    // extract routes that is program specific routes
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
                isSideBarOpen: programRoute['isSideBarOpen'],
                isMobile: programRoute['isMobile']
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
