import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DashboardListService } from './../../etl-api/dashboard-list.service';

@Component({
    selector: 'dashboard-list',
    templateUrl: 'dashboard-list.component.html',
    styleUrls: ['dashboard-list.component.scss']
})
export class DashboardListComponent implements OnInit {

    @Output()
    public dashboardSelected: EventEmitter<any> = new EventEmitter();

    @Output()
    public dashboardsLoaded: EventEmitter<any> = new EventEmitter();

    public isBusy: boolean = false;
    public errorMessage: string = '';

    public dashboards: Array<any> = [];

    constructor(private _dashboardListService: DashboardListService) {

    }

    public ngOnInit() {
        this.isBusy = true;
        this.errorMessage = '';
        let sub = this._dashboardListService.fetchDashboards()
        .subscribe((results) => {
            this.dashboards = results;
            this.isBusy = false;

        },
        (error) => {

            console.error('Error loading dashboards', error);
            this.errorMessage = 'Error loading available dashboards. Details: ' + error;
            this.isBusy = false;

        });
    }

    public viewDashboard(selectedDashboard: any) {
        this.dashboardSelected.emit(selectedDashboard);
    }

    public getDashboardById(dashboardId: number) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].id === dashboardId) {
                return this.dashboards[i];
            }
        }
    }

}
