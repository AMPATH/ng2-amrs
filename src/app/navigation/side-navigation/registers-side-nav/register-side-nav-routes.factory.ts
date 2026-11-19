import { Injectable } from '@angular/core';

import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { RouteModel } from '../../../shared/dynamic-route/route.model';
import { Patient } from '../../../models/patient.model';
import { LocalStorageService } from '../../../utils/local-storage.service';
@Injectable()
export class RegistersRoutesFactory {
  public selectedDepartment: any;

  constructor(
    public routesProvider: RoutesProviderService,
    private _localStorageService: LocalStorageService
  ) {}

  // public createClinicDashboardRoutes(locationUuid): RouteModel[] {
  //   if (locationUuid === null || locationUuid === undefined) {
  //     throw new Error('Location is required');
  //   }
  //   let selectedDepartment: any;
  //   const setDepartment: any = JSON.parse(
  //     this._localStorageService.getItem('userDefaultDepartment')
  //   );
  //   selectedDepartment = setDepartment[0].itemName;
  //   this.selectedDepartment = selectedDepartment;

  //   let clinicRoutesConfig: any = this.routesProvider.clinicDashboardConfig;
  //   clinicRoutesConfig = this.processSharedRoutes(clinicRoutesConfig);

  //   const routes: RouteModel[] = [];
  //   if (Array.isArray(clinicRoutesConfig['departments'])) {
  //     for (const department of clinicRoutesConfig.departments) {
  //       const departmentName = department.departmentName;
  //       if (departmentName === this.selectedDepartment) {
  //         routes.push(this.createregistersRouteModel(department, locationUuid));
  //       }
  //     }
  //   }

  //   return routes;
  // }

  public createRegistersDashboardRoutes(): RouteModel[] {
    let selectedDepartment: any;
    const setDepartment: any = JSON.parse(
      this._localStorageService.getItem('userDefaultDepartment')
    );
    selectedDepartment = setDepartment[0].itemName;
    this.selectedDepartment = selectedDepartment;

    let registersRoutesConfig: any = this.routesProvider
      .registersDashboardConfig;
    registersRoutesConfig = this.processSharedRoutes(registersRoutesConfig);

    const routes: RouteModel[] = [];
    if (Array.isArray(registersRoutesConfig['departments'])) {
      for (const department of registersRoutesConfig.departments) {
        const departmentName = department.departmentName;
        if (departmentName === this.selectedDepartment) {
          routes.push(this.createRegistersRouteModel(department));
        }
      }
    }
    console.log('createRegistersDashboardRoutes: ', routes);
    return routes;
  }

  public processSharedRoutes(routesConfig) {
    if (routesConfig.sharedRoutes) {
      for (const prog of routesConfig.programs) {
        if (prog['shared-routes-class']) {
          prog.routes = routesConfig.sharedRoutes[prog['shared-routes-class']];
        }
      }
    }
    return routesConfig;
  }

  // private createregistersRouteModel(
  //   routInfo: any,
  //   locationUuid: string
  // ): RouteModel {
  //   const model = new RouteModel();
  //   model.label = routInfo.departmentName;
  //   model.initials = (routInfo.departmentName as string).charAt(0);
  //   model.url = 'clinic-dashboard/' + locationUuid + '/' + routInfo.alias;
  //   model.renderingInfo = {
  //     icon: 'fa fa-square-o'
  //   };
  //   this.createRegistersChildRoutes(routInfo.routes, model);
  //   return model;
  // }

  private createRegistersRouteModel(routInfo: any): RouteModel {
    const model = new RouteModel();
    model.label = routInfo.departmentName;
    model.initials = (routInfo.departmentName as string).charAt(0);
    model.url = 'registers-dashboard/' + routInfo.alias;
    model.renderingInfo = {
      icon: 'fa fa-square-o'
    };
    this.createRegistersChildRoutes(routInfo.routes, model);
    return model;
  }

  private createRegistersChildRoutes(
    routInfo: any[],
    registersRouteModel: RouteModel
  ) {
    registersRouteModel.childRoutes = [];
    routInfo.forEach((route) => {
      registersRouteModel.childRoutes.push(
        this.createRegistersChildRoute(route, registersRouteModel)
      );
    });
  }

  private createRegistersChildRoute(
    routInfo: any,
    registersRouteModel: RouteModel
  ): RouteModel {
    const model = new RouteModel();
    model.url = registersRouteModel.url + '/' + routInfo.url;
    model.label = routInfo.label;
    model.initials = routInfo.initials || (routInfo.label as string).charAt(0);
    model.renderingInfo = {
      icon: routInfo.icon
    };
    model.isDistinct = routInfo.isDistinct;
    return model;
  }
}
