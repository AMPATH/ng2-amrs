import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// import { trigger, style, animate, transition } from '@angular/animations';

import { KibanaVizComponent } from '../../shared/kibana-viz/kibana-viz.component';
import { DashboardListComponent } from '../dashboard-list/dashboard-list.component';
@Component({
  selector: 'dashboards-viewer',
  templateUrl: 'dashboards-viewer.component.html',
  styleUrls: ['dashboards-viewer.component.css']
})
export class DashboardsViewerComponent
  extends KibanaVizComponent
  implements OnInit, OnDestroy
{
  public dashboard: any;
  public kibanaVizUrl = '';
  public width = '99%';
  public height = '1680';

  @ViewChild('dashboardListComponent')
  public dashboardList: DashboardListComponent;

  public resolveDashboardByIdAfterListLoaded = false;
  public busyIndicator = {
    busy: false,
    message: ''
  };

  constructor(
    protected route: ActivatedRoute,
    protected location: Location,
    protected router: Router
  ) {
    super(route, location, router);
  }

  public ngOnInit() {
    super.ngOnInit();
    const path = this.router.parseUrl(this.location.path());
    if (path.queryParams['id']) {
      this.resolveDashboardByIdAfterListLoaded = true;
    }
  }
  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public onDashboardSelected(dashboard) {
    this.dashboard = dashboard;
    this.displayDashboard(dashboard);
  }

  public onDashboardsLoaded(dashboards) {
    // console.log('dashboards', dashboards);
    if (this.resolveDashboardByIdAfterListLoaded) {
      this.loadDashboardById();
    }
  }

  public loadDashboardById() {
    const dashboardId = this.extractDashboardFromUrl();
    const dashboard = this.dashboardList.getDashboardById(dashboardId);
    this.dashboard = dashboard;
    this.width = dashboard.width;
    this.height = dashboard.height;
    if (!this.kibanaVizUrl || this.kibanaVizUrl.length === 0) {
      this.kibanaVizUrl = dashboard.url;
    }
    this.resolveDashboardByIdAfterListLoaded = false;
  }

  public extractDashboardFromUrl(): number {
    const path = this.router.parseUrl(this.location.path());
    if (path.queryParams['id']) {
      return Number.parseInt(path.queryParams['id']);
    }
  }

  public displayDashboard(dashboard) {
    this.startLoading();
    this.width = dashboard.width;
    this.height = dashboard.height;
    this.kibanaVizUrl = dashboard.url.replace(/^\n|\n$/g, '');

    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      id: dashboard.id
    };
    this.location.replaceState(path.toString());
    setTimeout(() => {
      this.endLoading();
    }, 1000);
  }
  public startLoading() {
    this.busyIndicator = {
      busy: true,
      message: 'Fetching visualization...please wait'
    };
  }
  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: ''
    };
  }
}
