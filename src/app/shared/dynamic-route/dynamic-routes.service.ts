import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { DynamicRouteModel } from "./dynamic-route.model";
import { ProgramEnrollment } from "../../models/program-enrollment.model";
import { DashboardModel } from "./dashboard.model";
import { RouteModel } from "./route.model";
@Injectable()
export class DynamicRoutesService {
  public routes = new ReplaySubject(1);
  public patientRoutes = new ReplaySubject<Array<RouteModel>>(1);
  public clinicRoutes = new ReplaySubject<Array<RouteModel>>(1);
  public analyticsRoutes = new ReplaySubject<Array<RouteModel>>(1);
  public selectedDepartment = "HIV";
  public routesModel = {};
  public dashboardConfig: DashboardModel = null;
  public analyticsDashboardConfig: object = require("./schema/analytics.dashboard.conf.json");
  public clinicDashboardConfig: object = require("./schema/clinic.dashboard.conf.json");
  public patientDashboardConfig: object = require("./schema/patient.dashboard.conf.json");
  public patientListCohortConfig: object = require("./schema/patientlist.dashboard.conf.json");
  public providerDashboardConfig: object = require("./schema/provider.dashboard.conf.json");

  constructor() {
    this.dashboardConfig = {
      analyticsDashboard: this.analyticsDashboardConfig,
      clinicDashboard: this.clinicDashboardConfig,
      patientDashboard: this.patientDashboardConfig,
      patientListCohorts: this.patientListCohortConfig,
      providerDashboard: this.providerDashboardConfig,
    };
  }

  public resetRoutes() {
    Object.assign(this.routesModel, {
      dashboardId: "",
      programs: [],
      moduleLabel: "",
      params: {},
      routes: [],
    });
    this.routes.next(this.routesModel);
    this.patientRoutes.next(new Array<RouteModel>());
    this.clinicRoutes.next(new Array<RouteModel>());
    this.analyticsRoutes.next(new Array<RouteModel>());
  }

  public setRoutes(route: DynamicRouteModel) {
    if (this.dashboardConfig) {
      const routes: Array<object> = this.extractRoutes(
        route,
        this.dashboardConfig
      );
      route.routes = routes;
      Object.assign(this.routesModel, route);
      this.routes.next(this.routesModel);
    }
  }

  public setPatientDashBoardRoutes(pRoutes: Array<RouteModel>) {
    this.patientRoutes.next(pRoutes);
  }

  public setClinicDashBoardRoutes(cRoutes: Array<RouteModel>) {
    this.clinicRoutes.next(cRoutes);
  }

  public setAnalyticsDashBoardRoutes(aRoutes: Array<RouteModel>) {
    this.analyticsRoutes.next(aRoutes);
  }

  public extractRoutes(
    route: DynamicRouteModel,
    dashboardConfig: object
  ): Array<object> {
    const dashboard: object = dashboardConfig[route.dashboardId];
    const routes: Array<object> = [];
    // extract routes that is common to all programs
    dashboard["nonProgramRoutes"].forEach((nonProgramRoute: object) => {
      const url =
        dashboard["baseRoute"] +
        this.extractParameter(dashboard["routeParameter"], route) +
        "/" +
        nonProgramRoute["url"];
      routes.push({
        url: url,
        label: nonProgramRoute["label"],
        icon: nonProgramRoute["icon"],
        menuStartLetter: this.getMenuStartLetter(nonProgramRoute["label"]),
        isSideBarOpen: nonProgramRoute["isSideBarOpen"],
        isDistinct: nonProgramRoute["isDistinct"] ? true : false,
        onClick: this.hideSidebar,
      });
    });

    // extract routes that is program specific
    dashboard["programs"].forEach((program: Array<object>) => {
      route.programs.forEach((enrolledProgram: ProgramEnrollment) => {
        if (enrolledProgram.program.uuid === program["programUuid"]) {
          program["routes"].forEach((programRoute: object) => {
            const url =
              dashboard["baseRoute"] +
              this.extractParameter(dashboard["routeParameter"], route) +
              "/" +
              programRoute["url"];
            const singleRoute = {
              url,
              label: programRoute["label"],
              icon: programRoute["icon"],
              menuStartLetter: this.getMenuStartLetter(programRoute["label"]),
              isSideBarOpen: programRoute["isSideBarOpen"],
              isDistinct: programRoute["isDistinct"] ? true : false,
              onClick: this.hideSidebar,
            };
            const index = routes.findIndex((x) => x["url"] === url);
            if (index === -1) {
              routes.push(singleRoute);
            }
          });
        }
      });
    });

    // extract routes that is deparment specific
    dashboard["departments"].forEach((department: Array<object>) => {
      department["routes"].forEach((departmentRoute: object) => {
        const url =
          dashboard["baseRoute"] +
          this.extractParameter(dashboard["routeParameter"], route) +
          "/" +
          departmentRoute["url"];
        const singleRoute = {
          url,
          label: departmentRoute["label"],
          icon: departmentRoute["icon"],
          menuStartLetter: this.getMenuStartLetter(departmentRoute["label"]),
          isSideBarOpen: departmentRoute["isSideBarOpen"],
          isDistinct: departmentRoute["isDistinct"] ? true : false,
          onClick: this.hideSidebar,
        };
        routes.push(singleRoute);
      });
    });

    return routes;
  }

  public getMenuStartLetter(label: string) {
    label = label.trim();
    return label === "Lab Orders" ? "O" : label.substring(0, 1);
  }

  public hideSidebar($event) {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("sidebar-collapse");
    body.classList.remove("sidebar-open");
    body.classList.add("sidebar-collapse");
  }

  public extractParameter(
    routeParameterKey: string,
    route: DynamicRouteModel
  ): string {
    if (routeParameterKey) {
      return "/" + route.params[routeParameterKey];
    } else {
      return "";
    }
  }
}
