import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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

    public dashboards: Array<any> = [
        {
            id: 1,
            title: 'MOH 731 Monthly Analysis',
            department: 'hiv',
            width: '99%',
            height: '1680',
            description: 'MOH 731 Monthly Analysis by Month',
            // tslint:disable-next-line:max-line-length
            url: "https://ngx.ampath.or.ke/app/kibana#/dashboard/8d203b00-164e-11e8-84c2-7d8bcda8ca46?embed=true&_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))",
            allowedDashboards: ['clinic', 'data-analytics']
        }
    ];

    constructor() {

    }

    public ngOnInit() {
        this.isBusy = true;
        this.errorMessage = '';
        let sub = this.fetchDashboards().subscribe(
            (dashboards) => {
                sub.unsubscribe();
                this.isBusy = false;
            },
            (error) => {
                console.error('Error loading dashboards', error);
                this.errorMessage = 'Error loading available dashboards. Details: ' + error;
                this.isBusy = false;
                sub.unsubscribe();
            }
        );
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
        let subject: Subject<Array<any>> = new Subject<Array<any>>();
        setTimeout(() => {
            subject.next(this.dashboards);
            this.dashboardsLoaded.emit(this.dashboards);
        }, 1000);
        return subject;
    }

}
