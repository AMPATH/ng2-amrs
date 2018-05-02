import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// import { trigger, style, animate, transition } from '@angular/animations';

import { KibanaVizComponent } from '../../shared/kibana-viz/kibana-viz.component';
import { DashboardListComponent } from '../dashboard-list/dashboard-list.component';
@Component({
    selector: 'dashboards-viewer',
    templateUrl: 'dashboards-viewer.component.html',
    // animations: [
    //     trigger(
    //         'enterAnimation', [
    //             transition(':enter', [
    //                 style({ transform: 'translateX(100%)', opacity: 0 }),
    //                 animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
    //             ]),
    //             transition(':leave', [
    //                 style({ transform: 'translateX(0)', opacity: 1 }),
    //                 animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
    //             ])
    //         ]
    //     )
    // ],
    styleUrls: ['dashboards-viewer.component.css']
})
export class DashboardsViewerComponent extends KibanaVizComponent implements OnInit, OnDestroy {
    public dashboard;

    @ViewChild('dashboardListComponent')
    public dashboardList: DashboardListComponent;

    public resolveDashboardByIdAfterListLoaded: boolean = false;

    constructor(
        protected route: ActivatedRoute,
        protected location: Location,
        protected router: Router
    ) {
        super(route, location, router);
    }

    public ngOnInit() {
        super.ngOnInit();
        let path = this.router.parseUrl(this.location.path());
        if (path.queryParams['id']) {
            this.resolveDashboardByIdAfterListLoaded = true;
        }
    }
    public ngOnDestroy() {
        super.ngOnDestroy();
    }

    public onDashboardSelected(dashboard) {
        // console.log('dashboard selected', dashboard);
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
        let dashboardId = this.extractDashboardFromUrl();
        let dashboard = this.dashboardList.getDashboardById(dashboardId);
        this.dashboard = dashboard;
        this.width = dashboard.width;
        this.height = dashboard.height;
        if (!this.kibanaVizUrl || this.kibanaVizUrl.length === 0) {
            this.kibanaVizUrl = dashboard.url;
        }
        this.resolveDashboardByIdAfterListLoaded = false;
    }

    public extractDashboardFromUrl(): number {
        let path = this.router.parseUrl(this.location.path());
        if (path.queryParams['id']) {
            return Number.parseInt(path.queryParams['id']);
        }
    }

    public displayDashboard(dashboard) {
        this.width = dashboard.width;
        this.height = dashboard.height;
        this.kibanaVizUrl = dashboard.url;

        let path = this.router.parseUrl(this.location.path());
        path.queryParams = {
            'id': dashboard.id
        };
        this.location.replaceState(path.toString());
    }
}
