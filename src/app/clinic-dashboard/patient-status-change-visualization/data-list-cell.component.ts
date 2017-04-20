import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
@Component({
    selector: 'data-list-cell',
    templateUrl: 'patient-list-cell.component.html'
})

export class DatalistCellComponent {
    private params: any;
    constructor(private router: Router, private route: ActivatedRoute) { }
    agInit(params: any): void {
        this.params = params;
    }
    clicked() {
        console.log('Clicked', this.params);
        let dateMoment = Moment(this.params.data.reporting_date);
        let startOfMonth = dateMoment.startOf('month').format('YYYY-MM-DD');
        let endOfMonth = dateMoment.endOf('month').format('YYYY-MM-DD');
        this.router.navigate(['./patient-list']
            , {
                relativeTo: this.route, queryParams: {
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                    indicator: this.params.column.colId
                }
            });
    }
}
