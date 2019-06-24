// tslint:disable:max-line-length
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KibanaDashboardListService } from './../../etl-api/kibana-dashboard-list-service';

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

    public isBusy = false;
    public errorMessage = '';

    public dashboards: Array<any> = [
    ];

    constructor(private kibanaDashboardListService: KibanaDashboardListService) {

    }

    public ngOnInit() {
        this.isBusy = true;
        this.errorMessage = '';
        this.kibanaDashboardListService.getKibanaDahboards()
        .subscribe((dashboards: any) => {
            this.dashboards = dashboards;
            this.isBusy = false;
        }, (error) => {
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

    public fetchDashboards(): Observable<Array<any>> {
        // TODO: Add functionality to make the actual call to the server
        const subject: Subject<Array<any>> = new Subject<Array<any>>();
        setTimeout(() => {
            subject.next(this.dashboards);
            this.dashboardsLoaded.emit(this.dashboards);
        }, 1000);
        return subject;
    }

}
